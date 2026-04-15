package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "수령 방식별 연금 계획 데이터")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionPayoutPlanDto {

	@Schema(description = "수령 방식 타입", example = "FIXED", allowableValues = {"FIXED", "FRONT_LOADED", "GROWING"})
	private String type;

	@Schema(description = "수령 방식 한글명", example = "정액형")
	private String label;

	@Schema(description = "20년 총 누적 수령액 (원) — 추천 방식 선정 기준", example = "720000000")
	private BigDecimal totalCumulativeAmount;

	@Schema(description = "차트 제공 연도별 월 수령액 및 누적 수령액 (1, 4, 7, 10, 13, 16, 19, 20년)")
	private List<PensionPayoutYearlyDto> yearlyData;
}
