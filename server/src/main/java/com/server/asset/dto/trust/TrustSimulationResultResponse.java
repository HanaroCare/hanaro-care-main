package com.server.asset.dto.trust;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

@Schema(description = "신탁 설계 결과 응답")
public record TrustSimulationResultResponse(

	@Schema(description = "현재 선택된 원금 기준 상세 내역")
	SimulationDetailDto selectedDetail,

	@Schema(description = "예치 금액별 비교 데이터 (차트용)")
	List<AmountResultDto> amountResults

) {
	@Schema(description = "시뮬레이션 상세 내역")
	public record SimulationDetailDto(
		@Schema(description = "원금", example = "50000000")
		BigDecimal principalAmount,

		@Schema(description = "예상 총 수익 (세전, 5년 복리)", example = "11832197")
		BigDecimal expectedProfit,

		@Schema(description = "세금 (15.4%)", example = "1822158")
		BigDecimal tax,

		@Schema(description = "예상 실 수령액 (세후)", example = "60010039")
		BigDecimal expectedNetAmount,

		@Schema(description = "세후 수익률 (%)", example = "20.0")
		BigDecimal profitRate
	) {}

	@Schema(description = "예치 금액별 결과 (차트 막대 1개)")
	public record AmountResultDto(
		@Schema(description = "금액 레이블", example = "5천만")
		String label,

		@Schema(description = "원금", example = "50000000")
		BigDecimal principalAmount,

		@Schema(description = "예상 총 수익 (세전)", example = "11832197")
		BigDecimal expectedProfit,

		@Schema(description = "세금 (15.4%)", example = "1822158")
		BigDecimal tax,

		@Schema(description = "예상 실 수령액 (세후)", example = "60010039")
		BigDecimal expectedNetAmount,

		@Schema(description = "세후 수익률 (%)", example = "20.0")
		BigDecimal profitRate,

		@Schema(description = "현재 선택된 막대 여부", example = "true")
		boolean isSelected
	) {}
}
