package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Schema(description = "주택연금 요약 카드 응답")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionSimulationSummaryResponse {

	@Schema(description = "추천 수령 방식 타입", example = "FIXED")
	private String recommendedType;

	@Schema(description = "추천 수령 방식 이름", example = "정액형")
	private String recommendedLabel;

	@Schema(description = "월 수령액", example = "3040000")
	private BigDecimal recommendedMonthlyAmount;

	@Schema(description = "누적 수령액", example = "490000000")
	private BigDecimal recommendedCumulativeAmount;
}
