package com.server.asset.dto.trust;

import com.server.asset.entity.enums.TrustAccessLevel;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "가족 신탁 권한 조회 응답 DTO")
public record TrustAccessResponse(
	@Schema(description = "권한을 부여한 사람(부모)의 ID", example = "1001")
	Long grantorUserId,

	@Schema(description = "권한을 부여받은 사람(자녀)의 ID", example = "2002")
	Long granteeUserId,

	@Schema(description = "권한 수준 요약 (READ_WRITE, PROXY_ONLY, NONE)")
	TrustAccessLevel accessLevel
) {}
