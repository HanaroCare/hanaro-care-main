package com.server.asset.dto.trust;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "신탁 상품 운용현황 응답")
public record TrustProductResponse(

	@Schema(description = "가입 상품 ID", example = "1234567890")
	Long userProdId,

	@Schema(description = "상품명", example = "내맘대로신탁")
	String productName,

	@Schema(
		description = "상품 상태",
		example = "IN_PROGRESS",
		allowableValues = {"IN_PROGRESS", "CANCELLED", "EXPIRED"}
	)
	String prodStatus,

	@Schema(description = "현재 자산 (원금 + 세후 누적 수익 - 누적 집행 금액)", example = "51500000")
	BigDecimal currentAmount,

	@Schema(description = "세후 수익률 (%)", example = "20.0")
	BigDecimal profitRate,

	@Schema(description = "원금", example = "50000000")
	BigDecimal principalAmount,

	@Schema(description = "등록일부터 현재까지 누적 집행 금액", example = "1500000")
	BigDecimal executionAmount,

	@Schema(description = "세후 누적 수익", example = "1500000")
	BigDecimal profit,

	@Schema(description = "집행 설정 (병원비 / 생활비)")
	ExecutionSetting executionSetting,

	@Schema(description = "지급청구대리인 정보")
	ClaimAgent claimAgent,

	@Schema(description = "대리인 열람 권한 여부", example = "true")
	Boolean agentViewEnabled

) {
	@Schema(description = "집행 설정")
	public record ExecutionSetting(

		@Schema(description = "병원비 집행 여부", example = "true")
		Boolean hospitalEnabled,

		@Schema(description = "병원비 월 집행 금액", example = "500000")
		BigDecimal hospitalAmount,

		@Schema(description = "생활비 집행 여부", example = "true")
		Boolean livingEnabled,

		@Schema(description = "생활비 월 집행 금액", example = "250000")
		BigDecimal livingAmount

	) {}

	@Schema(description = "지급청구대리인 정보")
	public record ClaimAgent(

		@Schema(description = "대리인 userId", example = "1002")
		Long userId,

		@Schema(description = "대리인 이름", example = "권하나")
		String userName,

		@Schema(description = "관계 라벨", example = "배우자")
		String relation

	) {}
}
