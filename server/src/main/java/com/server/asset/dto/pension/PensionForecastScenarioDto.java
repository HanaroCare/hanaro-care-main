package com.server.asset.dto.pension;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionForecastScenarioDto {
	private String scenarioType;
	private BigDecimal annualRate;
	private BigDecimal predictedPrice;
	private BigDecimal probability;
}
