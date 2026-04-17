package com.server.asset.dto.trust;

import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.StartType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "신탁 설계 조건 저장 요청")
public record TrustSimulationSaveRequest(

	@NotNull
	@Positive
	@Schema(description = "원금", example = "50000000")
	BigDecimal principalAmount,

	@NotNull
	@Schema(
		description = "신탁 시작 유형",
		example = "NOW",
		allowableValues = {"NOW", "SCHEDULED", "CUSTOM"}
	)
	StartType startType,

	@Schema(description = "직접 지정 시작일 - startType이 CUSTOM일 때만 필수", example = "2026-06-01")
	LocalDate startDate,

	@NotNull
	@Schema(
		description = "운용 유형",
		example = "LUMP_SUM",
		allowableValues = {"LUMP_SUM", "DIRECT"}
	)
	InvestType investType,

	@NotNull
	@Schema(
		description = "지급 유형",
		example = "FLEXIBLE",
		allowableValues = {"FLEXIBLE", "PENSION"}
	)
	PayoutType payoutType,

	@Valid
	@Schema(description = "지급 설정 (생략 가능)")
	TrustPayoutSettingsDto payoutSettings,

	@Schema(description = "대리인 userId (생략 가능)", example = "12345679")
	Long claimAgentId

) {}
