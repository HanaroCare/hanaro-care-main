package com.server.asset.service.pension;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.pension.PensionForecastInternalDto;
import com.server.common.config.GeminiProperties;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Primary
@Component
@RequiredArgsConstructor
public class GeminiRealEstatePricePredictor implements PensionPricePredictor {

	private static final String MODEL = "gemini-2.0-flash";
	private static final String MODEL_VERSION = "gemini-2.0-flash";

	@Qualifier("geminiRestClient")
	private final RestClient geminiRestClient;
	private final GeminiProperties geminiProperties;
	private final ObjectMapper objectMapper;

	@Override
	public PensionForecastInternalDto.Result predict(PensionForecastInternalDto.Command command) {
		GeminiScenarioResult geminiResult = callGemini(command);
		return buildResult(command, geminiResult);
	}

	// ── Gemini 호출 ─────────────────────────────────────────────────────────────

	private GeminiScenarioResult callGemini(PensionForecastInternalDto.Command command) {
		String prompt = buildPrompt(command);
		Map<String, Object> requestBody = Map.of(
			"contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
			"generationConfig", Map.of("response_mime_type", "application/json")
		);

		try {
			String rawJson = geminiRestClient.post()
				.uri("/{model}:generateContent?key={key}", MODEL, geminiProperties.getApiKey())
				.contentType(MediaType.APPLICATION_JSON)
				.body(requestBody)
				.retrieve()
				.body(String.class);

			GeminiApiResponse apiResponse = objectMapper.readValue(rawJson, GeminiApiResponse.class);
			String resultText = apiResponse.candidates().get(0).content().parts().get(0).text();
			return objectMapper.readValue(resultText, GeminiScenarioResult.class);

		} catch (Exception e) {
			log.warn("Gemini API 호출 실패, 기본값으로 폴백합니다. addr={}, error={}", command.getAddr(), e.getMessage());
			return fallbackResult();
		}
	}

	private String buildPrompt(PensionForecastInternalDto.Command command) {
		return """
			당신은 한국 부동산 시장 전문가입니다.
			아래 부동산 정보를 바탕으로 %d년 후 시세를 분석해 주세요.

			- 주소: %s
			- 현재 평가금액: %s원
			- 면적: %s㎡

			다음 JSON 형식으로만 응답하세요. 설명 없이 JSON만 출력하세요:
			{
			  "scenarios": [
			    { "type": "UP",   "annualRate": 0.05, "probability": 0.30 },
			    { "type": "BASE", "annualRate": 0.02, "probability": 0.50 },
			    { "type": "DOWN", "annualRate": -0.01, "probability": 0.20 }
			  ],
			  "recommendedScenario": "BASE",
			  "recommendedTitle": "중립 시나리오 추천",
			  "recommendedDescription": "현재 시장 상황과 지역 특성을 고려한 분석 내용."
			}

			- annualRate는 연간 상승/하락률 소수 표현 (예: 5%% → 0.05, -1%% → -0.01)
			- probability 세 값의 합은 반드시 1.0
			- recommendedDescription은 해당 주소의 지역 특성과 시장 상황을 반영해 3문장 이내로 작성
			""".formatted(
			command.getPeriodYears(),
			command.getAddr(),
			command.getCurrentPrice().toPlainString(),
			command.getAssetSize() != null ? command.getAssetSize().toPlainString() : "미제공"
		);
	}

	// ── 결과 조립 ────────────────────────────────────────────────────────────────

	private PensionForecastInternalDto.Result buildResult(
		PensionForecastInternalDto.Command command,
		GeminiScenarioResult geminiResult
	) {
		int years = command.getPeriodYears();
		BigDecimal currentPrice = command.getCurrentPrice();

		List<PensionForecastInternalDto.Scenario> scenarios = geminiResult.scenarios().stream()
			.map(s -> PensionForecastInternalDto.Scenario.builder()
				.scenarioType(s.type())
				.annualRate(s.annualRate())
				.predictedPrice(compoundGrowth(currentPrice, s.annualRate(), years))
				.probability(s.probability())
				.build())
			.toList();

		BigDecimal upRate   = rateOf(geminiResult, "UP");
		BigDecimal baseRate = rateOf(geminiResult, "BASE");
		BigDecimal downRate = rateOf(geminiResult, "DOWN");

		List<PensionForecastInternalDto.ChartPoint> chartPoints = IntStream.rangeClosed(1, years)
			.mapToObj(year -> PensionForecastInternalDto.ChartPoint.builder()
				.year(year)
				.upPrice(compoundGrowth(currentPrice, upRate, year))
				.basePrice(compoundGrowth(currentPrice, baseRate, year))
				.downPrice(compoundGrowth(currentPrice, downRate, year))
				.build())
			.toList();

		return PensionForecastInternalDto.Result.builder()
			.periodYears(years)
			.scenarios(scenarios)
			.chartPoints(chartPoints)
			.recommendedScenario(geminiResult.recommendedScenario())
			.recommendedTitle(geminiResult.recommendedTitle())
			.recommendedDescription(geminiResult.recommendedDescription())
			.modelVersion(MODEL_VERSION)
			.predictedAt(LocalDateTime.now())
			.build();
	}

	// ── 유틸 ────────────────────────────────────────────────────────────────────

	private BigDecimal compoundGrowth(BigDecimal principal, BigDecimal annualRate, int years) {
		// principal * (1 + annualRate)^years
		BigDecimal factor = BigDecimal.ONE.add(annualRate)
			.pow(years, new MathContext(10, RoundingMode.HALF_UP));
		return principal.multiply(factor).setScale(0, RoundingMode.HALF_UP);
	}

	private BigDecimal rateOf(GeminiScenarioResult result, String type) {
		return result.scenarios().stream()
			.filter(s -> type.equals(s.type()))
			.map(GeminiScenarioResult.ScenarioItem::annualRate)
			.findFirst()
			.orElse(BigDecimal.ZERO);
	}

	private GeminiScenarioResult fallbackResult() {
		return new GeminiScenarioResult(
			List.of(
				new GeminiScenarioResult.ScenarioItem("UP",   new BigDecimal("0.04"), new BigDecimal("0.30")),
				new GeminiScenarioResult.ScenarioItem("BASE", new BigDecimal("0.02"), new BigDecimal("0.50")),
				new GeminiScenarioResult.ScenarioItem("DOWN", new BigDecimal("-0.01"), new BigDecimal("0.20"))
			),
			"BASE",
			"중립 시나리오 추천",
			"현재 평가금액 기준으로 가장 안정적으로 참고할 수 있는 예측이에요."
		);
	}

	// ── Gemini API 응답 모델 ─────────────────────────────────────────────────────

	@JsonIgnoreProperties(ignoreUnknown = true)
	private record GeminiApiResponse(List<Candidate> candidates) {
		@JsonIgnoreProperties(ignoreUnknown = true)
		private record Candidate(Content content) {}
		@JsonIgnoreProperties(ignoreUnknown = true)
		private record Content(List<Part> parts) {}
		@JsonIgnoreProperties(ignoreUnknown = true)
		private record Part(String text) {}
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	private record GeminiScenarioResult(
		List<ScenarioItem> scenarios,
		String recommendedScenario,
		String recommendedTitle,
		String recommendedDescription
	) {
		@JsonIgnoreProperties(ignoreUnknown = true)
		private record ScenarioItem(
			String type,
			BigDecimal annualRate,
			BigDecimal probability
		) {}
	}
}
