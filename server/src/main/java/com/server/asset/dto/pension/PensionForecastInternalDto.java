package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "주택 가격 예측 내부 DTO (AI 및 계산 로직용)")
public class PensionForecastInternalDto {

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	@Schema(description = "예측 요청 정보")
	public static class Command {

		@Schema(description = "부동산 주소", example = "서울 강남구 대치동")
		private String addr;

		@Schema(description = "현재 평가금액 (원)", example = "800000000")
		private BigDecimal currentPrice;

		@Schema(description = "면적 (㎡)", example = "84.5")
		private BigDecimal assetSize;

		@Schema(description = "예측 기간 (년)", example = "5")
		private Integer periodYears;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	@Schema(description = "예측 결과 (내부 모델)")
	public static class Result {

		@Schema(description = "예측 기간 (년)", example = "5")
		private Integer periodYears;

		@Schema(description = "확률 가중 기대값 (원)", example = "883265000")
		private BigDecimal expectedPrice;

		@Schema(description = "시나리오별 결과")
		private List<Scenario> scenarios;

		@Schema(description = "차트 데이터")
		private List<ChartPoint> chartPoints;

		@Schema(description = "추천 시나리오", example = "BASE")
		private String recommendedScenario;

		@Schema(description = "시장 요약")
		private String marketSummary;

		@Schema(description = "입지 요약")
		private String locationSummary;

		@Schema(description = "추천 이유")
		private String recommendedReason;

		@Schema(description = "모델 버전", example = "gemini-2.0-flash")
		private String modelVersion;

		@Schema(description = "예측 시각", example = "2026-04-14T21:00:00")
		private LocalDateTime predictedAt;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	@Schema(description = "시나리오별 계산 결과")
	public static class Scenario {

		@Schema(description = "시나리오 타입", example = "UP")
		private String scenarioType;

		@Schema(description = "시나리오 라벨", example = "낙관")
		private String scenarioLabel;

		@Schema(description = "연간 상승률", example = "0.04")
		private BigDecimal annualRate;

		@Schema(description = "총 상승률 (%)", example = "21.67")
		private BigDecimal totalGrowthRate;

		@Schema(description = "예측 가격", example = "973322000")
		private BigDecimal predictedPrice;

		@Schema(description = "확률", example = "0.30")
		private BigDecimal probability;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	@Schema(description = "연도별 차트 데이터")
	public static class ChartPoint {

		@Schema(description = "연도", example = "2027")
		private Integer year;

		@Schema(description = "비관 시나리오 가격", example = "800000000")
		private BigDecimal downPrice;

		@Schema(description = "중립 시나리오 가격", example = "816000000")
		private BigDecimal basePrice;

		@Schema(description = "낙관 시나리오 가격", example = "832000000")
		private BigDecimal upPrice;
	}
}
