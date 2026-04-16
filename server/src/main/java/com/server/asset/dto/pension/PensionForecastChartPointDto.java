package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Schema(description = "연도별 집값 예측 차트 포인트")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionForecastChartPointDto {

	@Schema(description = "연도", example = "2027")
	private Integer year;

	@Schema(description = "비관 시나리오 집값 (원)", example = "800000000")
	private BigDecimal downPrice;

	@Schema(description = "중립 시나리오 집값 (원)", example = "816000000")
	private BigDecimal basePrice;

	@Schema(description = "낙관 시나리오 집값 (원)", example = "832000000")
	private BigDecimal upPrice;
}
