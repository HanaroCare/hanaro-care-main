package com.server.asset.dto.trust;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(description = "신탁 자금 사용처 수정 요청")
public record TrustPayoutSettingsUpdateRequest(

	@NotNull
	@Valid
	@Schema(description = "집행 설정")
	TrustPayoutSettingsDto payoutSettings

) {}
