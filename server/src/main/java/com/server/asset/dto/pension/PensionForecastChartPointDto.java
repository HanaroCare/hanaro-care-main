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
public class PensionForecastChartPointDto {
	private Integer year;
	private BigDecimal downPrice;
	private BigDecimal basePrice;
	private BigDecimal upPrice;
}
