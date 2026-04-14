package com.server.asset.dto.trust;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "신탁 현황 열람 권한 수정 요청")
public record TrustAgentViewUpdateRequest(
	@NotNull
	@Schema(description = "대리인 열람 권한 활성화 여부", example = "true")
	Boolean agentViewEnabled
) {}
