package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Schema(description = "시나리오별 집값 예측 결과")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionForecastScenarioDto {

	@Schema(description = "시나리오 타입", example = "UP", allowableValues = {"UP", "BASE", "DOWN"})
	private String scenarioType;

	@Schema(description = "시나리오 한글명", example = "낙관")
	private String scenarioLabel;

	@Schema(description = "연간 상승률", example = "0.04")
	private BigDecimal annualRate;

	@Schema(description = "기간 전체 상승률 (%)", example = "21.67")
	private BigDecimal totalGrowthRate;

	@Schema(description = "예측 집값", example = "973322000")
	private BigDecimal predictedPrice;

	@Schema(description = "발생 확률", example = "0.30")
	private BigDecimal probability;
}
