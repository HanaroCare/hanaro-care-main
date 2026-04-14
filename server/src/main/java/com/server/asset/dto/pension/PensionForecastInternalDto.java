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
	public static class Scenario {
		private String scenarioType;
		private BigDecimal annualRate;
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
