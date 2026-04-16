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

	@Schema(description = "가입 생성일", example = "2026-05-01")
	private LocalDate createdAt;

	@Schema(description = "현재 가입 연차 (1-based)", example = "3")
	private int elapsedYear;

	@Schema(description = "이달의 수령액 (원)", example = "2050000")
	private BigDecimal currentMonthlyPayout;

	@Schema(description = "현재까지 누적 수령액 (원)", example = "73800000")
	private BigDecimal currentCumulativeAmount;

	@Schema(description = "누적 수령액 차트 (가입 시점 ~ 현재 + 10년)")
	private List<ChartPoint> chartPoints;

	@Schema(description = "차트 포인트")
	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class ChartPoint {
		@Schema(description = "가입 연차", example = "4")
		private int year;

		@Schema(description = "해당 연차 월 수령액 (원)", example = "2050000")
		private BigDecimal monthlyAmount;

		@Schema(description = "해당 연차까지 누적 수령액 (원)", example = "98400000")
		private BigDecimal cumulativeAmount;
	}
}
