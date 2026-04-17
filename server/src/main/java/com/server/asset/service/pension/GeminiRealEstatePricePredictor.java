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
import org.springframework.cache.annotation.Cacheable;
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
	@Cacheable(
		cacheNames = "pensionForecast",
		keyGenerator = "pensionForecastKeyGenerator",
		unless = "#result == null || #result.recommendedReason == '현재 평가금액 기준으로 중립 시나리오가 가장 안정적으로 참고할 수 있는 예측입니다.'"
	)
	public PensionForecastInternalDto.Result predict(PensionForecastInternalDto.Command command) {
		GeminiScenarioResult geminiResult = callGemini(command);
		return buildResult(command, geminiResult);
	}

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

			if (apiResponse.candidates() == null || apiResponse.candidates().isEmpty()) {
				log.warn(">>> [Gemini API 응답 오류] candidates가 비어있음. addr={}", command.getAddr());
				return fallbackResult(command);
			}

			String resultText = apiResponse.candidates().get(0).content().parts().get(0).text();

			// ── 로깅 추가: AI가 보낸 원본 JSON 텍스트 확인 ──
			log.info(">>> [Gemini API 원본 응답 텍스트]: {}", resultText);

			GeminiScenarioResult result = objectMapper.readValue(resultText, GeminiScenarioResult.class);

			// ── 로깅 추가: 특정 필드 값 존재 여부 확인 ──
			log.info(">>> [Gemini 분석 결과 확인] locationSummary: {}, recommendedReason: {}",
				result.locationSummary(), result.recommendedReason());

			return result;

		} catch (Exception e) {
			log.error(">>> [Gemini API 호출 예외 발생] addr={}, error={}", command.getAddr(), e.getMessage());
			return fallbackResult(command);
		}
	}

	private String buildPrompt(PensionForecastInternalDto.Command command) {
		return """
    당신은 한국 주택시장 분석가이다.
    입력된 주소와 면적, 현재 평가금액을 기준으로 해당 주택 또는 동일 생활권의 대표적인 아파트/주택 시세 맥락을 먼저 파악한 뒤,
    그 결과를 바탕으로 %d년 후 주택 가격 전망을 분석한다.

    입력 정보:
    - 주소: %s
    - 현재 평가금액: %s원
    - 면적: %s㎡

    분석 절차:
    1. 입력 주소를 기준으로 해당 주택의 단지명, 생활권, 교통, 학군, 실거주 수요 특성을 우선 식별한다.
    2. 동일 주소의 정확한 매물이 확인되지 않으면, 같은 동/생활권/유사 면적대의 공동주택 시세 흐름을 기준으로 추론한다.
    3. 최근 거래 분위기, 공급, 금리, 실거주 수요를 반영해 시나리오별 확률을 판단한다.
    4. 확률이 가장 높은 시나리오를 recommendedScenario로 선택한다.

    중요 규칙:
    - 입력 정보와 무관한 일반론만 작성하지 마라.
    - 주소 기반으로 지역 특성과 수요 요인을 반드시 반영하라.
    - 특정 단지명을 확신할 수 없으면 단정하지 말고, "해당 생활권", "유사 면적대", "인근 단지 흐름"처럼 보수적으로 표현하라.
    - 입력값만 반복하거나 현재 평가금액만 다시 설명하지 마라.
    - locationSummary와 recommendedReason에는 반드시 주소 기반 판단 근거가 드러나야 한다.
    - 문장은 서로 다른 정보를 담아야 하며, 같은 뜻 반복을 금지한다.
    - 모든 문장은 한국어 평서문으로 작성한다.
    - JSON 외의 텍스트는 절대 출력하지 마라.

    시나리오 연율은 이미 고정되어 있다:
    - UP(낙관): 연 +4%%
    - BASE(중립): 연 +2%%
    - DOWN(비관): 연 0%%

    반드시 아래 JSON 형식으로만 응답하라:
    {
      "scenarios": [
        { "type": "UP", "probability": 0.30 },
        { "type": "BASE", "probability": 0.50 },
        { "type": "DOWN", "probability": 0.20 }
      ],
      "recommendedScenario": "BASE",
      "marketSummary": "최근 시장 흐름에 대한 요약",
      "locationSummary": "입지, 생활권, 교통, 학군, 실거주 수요를 반영한 주소 기반 요약",
      "recommendedReason": "왜 이 주소와 생활권 기준으로 해당 시나리오를 추천하는지에 대한 결론"
    }

    JSON 작성 규칙:
    1. probability 세 값의 합은 반드시 1.0이어야 한다.
    2. recommendedScenario는 probability가 가장 높은 시나리오와 반드시 같아야 한다.
    3. marketSummary는 금리, 거래량, 수요심리 등 시장 요인을 반영한 1문장이어야 한다.
    4. locationSummary는 주소 기반 입지와 생활권 특성을 반영한 1문장이어야 한다.
    5. recommendedReason는 주소와 수요 특성을 근거로 왜 그 시나리오를 기준으로 봐야 하는지 설명하는 1문장이어야 한다.
    6. 다음 표현은 사용하지 마라:
       - "현재 평가금액 기준으로"
       - "안정적으로 참고할 수 있다"
       - "무난하다"
       - "일반적으로"
    7. recommendedReason는 marketSummary나 locationSummary를 단순 반복하지 마라.
    """
			.formatted(
				command.getPeriodYears(),
				command.getAddr(),
				command.getCurrentPrice().toPlainString(),
				command.getAssetSize() != null ? command.getAssetSize().toPlainString() : "미제공"
			);
	}

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

		int chartStartYear = 2020;
		int chartEndYear   = currentYear + 10;
		List<PensionForecastInternalDto.ChartPoint> chartPoints = IntStream.iterate(
				chartStartYear, y -> y <= chartEndYear, y -> y + 2)
			.mapToObj(y -> {
				int offset = y - currentYear;
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

		// ── 최종 결과 조립 전 값 확인 로깅 ──
		log.debug(">>> [최종 결과 조립] Market: {}, Location: {}, Reason: {}",
			geminiResult.marketSummary(), geminiResult.locationSummary(), geminiResult.recommendedReason());

		return PensionForecastInternalDto.Result.builder()
			.periodYears(years)
			.expectedPrice(expectedPrice)
			.scenarios(scenarios)
			.chartPoints(chartPoints)
			.recommendedScenario(geminiResult.recommendedScenario())
			.marketSummary(geminiResult.marketSummary())
			.locationSummary(geminiResult.locationSummary())
			.recommendedReason(geminiResult.recommendedReason())
			.modelVersion(MODEL_VERSION)
			.predictedAt(LocalDateTime.now().toString())
			.build();
	}

	private BigDecimal compoundGrowth(BigDecimal principal, BigDecimal annualRate, int years) {
		BigDecimal factor = BigDecimal.ONE.add(annualRate)
			.pow(years, new MathContext(10, RoundingMode.HALF_UP));
		return principal.multiply(factor).setScale(0, RoundingMode.HALF_UP);
	}

	private BigDecimal totalGrowthRate(BigDecimal annualRate, int years) {
		BigDecimal factor = BigDecimal.ONE.add(annualRate)
			.pow(years, new MathContext(10, RoundingMode.HALF_UP));
		return factor.subtract(BigDecimal.ONE)
			.multiply(new BigDecimal("100"))
			.setScale(2, RoundingMode.HALF_UP);
	}

	private GeminiScenarioResult fallbackResult(PensionForecastInternalDto.Command command) {
		log.info(">>> [폴백 사용] API 응답 실패로 인해 기본 데이터로 결과를 생성합니다.");
		return new GeminiScenarioResult(
			List.of(
				new GeminiScenarioResult.ScenarioItem("UP", new BigDecimal("0.30")),
				new GeminiScenarioResult.ScenarioItem("BASE", new BigDecimal("0.50")),
				new GeminiScenarioResult.ScenarioItem("DOWN", new BigDecimal("0.20"))
			),
			"BASE",
			"금리와 거래 흐름을 고려하면 급격한 변동보다 완만한 흐름 가능성이 높다.",
			"해당 주택은 현재 가격과 면적 기준으로 실수요 영향을 비교적 안정적으로 받을 가능성이 있다.",
			"중립 시나리오를 기준으로 전망을 참고하는 것이 적절하다."
		);
	}

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
		String marketSummary,
		String locationSummary,
		String recommendedReason
	) {
		@JsonIgnoreProperties(ignoreUnknown = true)
		private record ScenarioItem(String type, BigDecimal probability) {}
	}
}
