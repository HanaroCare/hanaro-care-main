package com.server.asset.dto.pension;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PensionForecastInternalDto {

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Command {
		private String addr;
		private BigDecimal currentPrice;
		private BigDecimal assetSize;
		private Integer periodYears;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Result {
		private Integer periodYears;
		private BigDecimal expectedPrice;  // 확률 가중 기댓값
		private List<HistoricalPrice> historicalPrices;
		private List<Scenario> scenarios;
		private List<ChartPoint> chartPoints;
		private String recommendedScenario;
		private String recommendedTitle;
		private String recommendedDescription;
		private String modelVersion;
		private LocalDateTime predictedAt;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class HistoricalPrice {
		private Integer year;
		private BigDecimal price;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Scenario {
		private String scenarioType;        // UP | BASE | DOWN
		private String scenarioLabel;       // 낙관 | 중립 | 비관
		private BigDecimal annualRate;      // 연간 상승률
		private BigDecimal totalGrowthRate; // 기간 전체 상승률 %
		private BigDecimal predictedPrice;
		private BigDecimal probability;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class ChartPoint {
		private Integer year;
		private BigDecimal downPrice;
		private BigDecimal basePrice;
		private BigDecimal upPrice;
	}

}
