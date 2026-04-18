package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Schema(description = "주택연금 수령 내역")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionPayoutHistoryResponse {

	@Schema(description = "가입 시작일부터 현재까지 총 수령액 (원)", example = "73800000")
	private BigDecimal totalReceivedAmount;

	@Schema(description = "월별 수령 내역 (최신순)")
	private List<PayoutRecord> history;

	@Schema(description = "다음 입금 예정일 (아직 수령 이력이 없는 경우)", example = "2026-04-25")
	private LocalDate nextPayoutDate;

	@Schema(description = "다음 입금 예정액 (원)", example = "2050000")
	private BigDecimal nextPayoutAmount;

	@Schema(description = "월별 수령 내역")
	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class PayoutRecord {

		@Schema(description = "수령일", example = "2026-05-01")
		private LocalDate payoutDate;

		@Schema(description = "수령액 (원)", example = "2050000")
		private BigDecimal amount;
	}
}
