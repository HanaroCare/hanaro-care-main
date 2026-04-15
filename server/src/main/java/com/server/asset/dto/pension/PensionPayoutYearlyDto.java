package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Schema(description = "연도별 월 수령액 및 누적 수령액")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionPayoutYearlyDto {

	@Schema(description = "수령 연차 (1 ~ 20)", example = "1")
	private Integer year;

	@Schema(description = "해당 연도 월 수령액 (원) — 슬라이더 선택 시 표시", example = "3000000")
	private BigDecimal monthlyAmount;

	@Schema(description = "해당 연도까지 누적 수령액 (원) — 차트 Y축", example = "36000000")
	private BigDecimal cumulativeAmount;
}
