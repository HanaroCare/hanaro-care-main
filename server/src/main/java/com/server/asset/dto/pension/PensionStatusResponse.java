package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
@Schema(description = "주택연금 운용 현황")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionStatusResponse {

	@Schema(description = "수령 방식 코드", example = "FIXED")
	private String pensionPayoutType;

	@Schema(description = "수령 방식 이름", example = "정액형")
	private String pensionPayoutLabel;

	@Schema(description = "가입일", example = "2026-05-01")
	private LocalDate createdAt;

	@Schema(description = "경과 연차", example = "3")
	private int elapsedYear;

	@Schema(description = "현재 월 수령액", example = "2050000")
	private BigDecimal currentMonthlyPayout;

	@Schema(description = "누적 수령액", example = "73800000")
	private BigDecimal currentCumulativeAmount;

	@Schema(description = "차트 데이터")
	private List<ChartPoint> chartPoints;

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	@Schema(description = "차트 포인트")
	public static class ChartPoint {

		@Schema(description = "연차", example = "4")
		private int year;

		@Schema(description = "월 수령액", example = "2050000")
		private BigDecimal monthlyAmount;

		@Schema(description = "누적 수령액", example = "98400000")
		private BigDecimal cumulativeAmount;
	}
}
