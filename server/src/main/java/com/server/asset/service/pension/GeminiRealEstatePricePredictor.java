package com.server.asset.service.pension;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.pension.PensionForecastInternalDto;
import com.server.common.config.GeminiProperties;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
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

	// 시나리오 연율 고정값
	private static final Map<String, BigDecimal> SCENARIO_RATES = Map.of(
		"UP",   new BigDecimal("0.04"),
		"BASE", new BigDecimal("0.02"),
		"DOWN", new BigDecimal("0.00")
	);

	private static final Map<String, String> SCENARIO_LABELS = Map.of(
		"UP",   "낙관",
		"BASE", "중립",
		"DOWN", "비관"
	);

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
			return fallbackResult(command);
		}
	}

	private String buildPrompt(PensionForecastInternalDto.Command command) {
		int currentYear = LocalDate.now().getYear();

		return """
			당신은 한국 부동산 시장 전문가입니다.
			아래 부동산 정보를 바탕으로 %d년 후 시장 전망을 분석해 주세요.

			- 주소: %s
			- 현재 평가금액: %s원 (%d년 기준)
			- 면적: %s㎡

			시나리오 연율은 이미 정해져 있습니다:
			- UP(낙관): 연 +4%%
			- BASE(중립): 연 +2%%
			- DOWN(비관): 연 0%%

			다음 JSON 형식으로만 응답하세요. 설명 없이 JSON만 출력하세요:
			{
			  "scenarios": [
			    { "type": "UP",   "probability": 0.30 },
			    { "type": "BASE", "probability": 0.50 },
			    { "type": "DOWN", "probability": 0.20 }
			  ],
			  "recommendedScenario": "BASE",
			  "recommendedReason": "학군 수요 기반의 안정적인 시세를 유지해왔으나 금리 부담으로 단기 상승은 제한적입니다."
			}

			조건:
			- probability: UP/BASE/DOWN 세 값의 합이 반드시 1.0, 해당 지역 시장 상황과 %d년 전망을 반영해 결정
			- recommendedScenario: probability가 가장 높은 시나리오의 type
			- recommendedReason: 해당 주소의 지역 특성(학군·위치·교통·개발호재 등)과 국내 부동산 시장 상황을 반영한 추천 이유 (1~2문장, 한국어)
			""".formatted(
			command.getPeriodYears(),
			command.getAddr(),
			command.getCurrentPrice().toPlainString(), currentYear,
			command.getAssetSize() != null ? command.getAssetSize().toPlainString() : "미제공",
			command.getPeriodYears()
		);
	}

	// ── 결과 조립 ────────────────────────────────────────────────────────────────

	private PensionForecastInternalDto.Result buildResult(
		PensionForecastInternalDto.Command command,
		GeminiScenarioResult geminiResult
	) {
		int years = command.getPeriodYears();
		int currentYear = LocalDate.now().getYear();
		BigDecimal currentPrice = command.getCurrentPrice();

		List<PensionForecastInternalDto.Scenario> scenarios = geminiResult.scenarios().stream()
			.map(s -> {
				BigDecimal rate = SCENARIO_RATES.getOrDefault(s.type(), BigDecimal.ZERO);
				BigDecimal predicted = compoundGrowth(currentPrice, rate, years);
				BigDecimal growth = totalGrowthRate(rate, years);
				return PensionForecastInternalDto.Scenario.builder()
					.scenarioType(s.type())
					.scenarioLabel(SCENARIO_LABELS.getOrDefault(s.type(), s.type()))
					.annualRate(rate)
					.totalGrowthRate(growth)
					.predictedPrice(predicted)
					.probability(s.probability())
					.build();
			})
			.toList();

		BigDecimal upRate   = SCENARIO_RATES.get("UP");
		BigDecimal baseRate = SCENARIO_RATES.get("BASE");
		BigDecimal downRate = SCENARIO_RATES.get("DOWN");

		// 차트: 2020년 ~ currentYear+10년, 2년 단위 (과거는 현재가 기준 역산)
		int chartStartYear = 2020;
		int chartEndYear   = currentYear + 10;
		List<PensionForecastInternalDto.ChartPoint> chartPoints = IntStream.iterate(
				chartStartYear, y -> y <= chartEndYear, y -> y + 2)
			.mapToObj(y -> {
				int offset = y - currentYear; // 음수=과거, 0=현재, 양수=미래
				return PensionForecastInternalDto.ChartPoint.builder()
					.year(y)
					.upPrice(compoundGrowth(currentPrice, upRate, offset))
					.basePrice(compoundGrowth(currentPrice, baseRate, offset))
					.downPrice(compoundGrowth(currentPrice, downRate, offset))
					.build();
			})
			.toList();

		BigDecimal expectedPrice = scenarios.stream()
			.map(s -> s.getPredictedPrice().multiply(s.getProbability()))
			.reduce(BigDecimal.ZERO, BigDecimal::add)
			.setScale(0, RoundingMode.HALF_UP);

		return PensionForecastInternalDto.Result.builder()
			.periodYears(years)
			.expectedPrice(expectedPrice)
			.scenarios(scenarios)
			.chartPoints(chartPoints)
			.recommendedScenario(geminiResult.recommendedScenario())
			.recommendedReason(geminiResult.recommendedReason())
			.modelVersion(MODEL_VERSION)
			.predictedAt(LocalDateTime.now())
			.build();
	}

	// ── 유틸 ────────────────────────────────────────────────────────────────────

	private BigDecimal compoundGrowth(BigDecimal principal, BigDecimal annualRate, int years) {
		BigDecimal factor = BigDecimal.ONE.add(annualRate)
			.pow(years, new MathContext(10, RoundingMode.HALF_UP));
		return principal.multiply(factor).setScale(0, RoundingMode.HALF_UP);
	}

	/** 기간 전체 상승률 (%) = ((1 + annualRate)^years - 1) * 100, 소수점 둘째 자리 */
	private BigDecimal totalGrowthRate(BigDecimal annualRate, int years) {
		BigDecimal factor = BigDecimal.ONE.add(annualRate)
			.pow(years, new MathContext(10, RoundingMode.HALF_UP));
		return factor.subtract(BigDecimal.ONE)
			.multiply(new BigDecimal("100"))
			.setScale(2, RoundingMode.HALF_UP);
	}

	private GeminiScenarioResult fallbackResult(PensionForecastInternalDto.Command command) {
		return new GeminiScenarioResult(
			List.of(
				new GeminiScenarioResult.ScenarioItem("UP",   new BigDecimal("0.30")),
				new GeminiScenarioResult.ScenarioItem("BASE", new BigDecimal("0.50")),
				new GeminiScenarioResult.ScenarioItem("DOWN", new BigDecimal("0.20"))
			),
			"BASE",
			"현재 평가금액 기준으로 중립 시나리오가 가장 안정적으로 참고할 수 있는 예측입니다."
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
		String recommendedReason
	) {
		@JsonIgnoreProperties(ignoreUnknown = true)
		private record ScenarioItem(String type, BigDecimal probability) {}
	}
}
