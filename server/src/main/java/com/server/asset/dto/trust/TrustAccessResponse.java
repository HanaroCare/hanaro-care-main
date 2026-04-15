package com.server.asset.dto.trust;

import com.server.asset.entity.enums.TrustAccessLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "가족 신탁 권한 목록 응답")
public record TrustAccessResponse(
	@Schema(description = "권한 목록")
	List<AccessItem> accessList
) {
	public record AccessItem(
		@Schema(description = "부모(grantor) userId", example = "1001")
		Long grantorId,

		@Schema(description = "부모 이름", example = "홍길동")
		String grantorName,

		@Schema(description = "권한 수준 (READ_WRITE, PROXY_ONLY, NONE)")
		TrustAccessLevel accessLevel
	) {}
}
