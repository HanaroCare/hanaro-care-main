package com.server.asset.dto.pension;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionForecastResponse {
	private Long realAssetId;
	private String assetNm;
	private BigDecimal currentPrice;
	private Integer periodYears;
	private List<PensionForecastScenarioDto> scenarios;
	private List<PensionForecastChartPointDto> chartPoints;
	private String recommendedScenario;
	private String recommendedTitle;
	private String recommendedDescription;
	private String modelVersion;
	private LocalDateTime predictedAt;
}
