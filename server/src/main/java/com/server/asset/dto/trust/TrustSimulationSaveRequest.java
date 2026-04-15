package com.server.asset.dto.trust;

import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.StartType;
import com.server.asset.entity.enums.TrustType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Schema(description = "신탁 설계 조건 저장 요청")
public record TrustSimulationSaveRequest(

	@NotNull
	@Schema(description = "원금", example = "50000000")
	BigDecimal principalAmount,

	@NotNull
	@Schema(description = "신탁 시작 유형", example = "NOW",
		allowableValues = {"NOW", "SCHEDULED", "CUSTOM"})
	StartType startType,

	@Schema(description = "직접 지정 시작일 — startType이 CUSTOM일 때만 필수", example = "2026-06-01")
	LocalDate startDate,

	@NotNull
	@Schema(description = "운용 유형", example = "LUMP_SUM",
		allowableValues = {"LUMP_SUM", "DIRECT"})
	InvestType investType,

	@NotNull
	@Schema(description = "지급 유형", example = "FLEXIBLE",
		allowableValues = {"FLEXIBLE", "PENSION"})
	PayoutType payoutType,

	@Schema(description = "지급 설정 (생략 가능)")
	PayoutSettingsDto payoutSettings,

	@Schema(description = "대리인 userId (생략 가능)", example = "12345679")
	Long claimAgentId

) {
	@Schema(description = "지급 항목 목록")
	public record PayoutSettingsDto(
		@Schema(description = "지급 항목 리스트")
		List<PayoutItemDto> items
	) {
		@Schema(description = "지급 항목")
		public record PayoutItemDto(
			@Schema(description = "지급 항목 유형", example = "HOSPITAL",
				allowableValues = {"HOSPITAL", "LIVING"})
			TrustType type,

			@Schema(description = "월 지급 금액", example = "500000")
			BigDecimal amount
		) {}
	}
}
