package com.server.asset.dto.trust;

import com.server.asset.entity.enums.TrustAccessLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "부모별 신탁 권한 목록 응답")
public record TrustGrantorResponse(

	@Schema(description = "부모 목록")
	List<GrantorItem> grantors

) {
	@Schema(description = "부모별 신탁 권한 정보")
	public record GrantorItem(

		@Schema(description = "부모(grantor) userId", example = "1001")
		Long grantorId,

		@Schema(description = "부모 이름", example = "홍길동")
		String grantorName,

		@Schema(description = "관계 코드", example = "PARENT")
		String relation,

		@Schema(description = "관계 한글 라벨", example = "부모")
		String relationLabel,

		@Schema(
			description = "신탁 권한 수준 (READ_WRITE: 대리인 + 읽기 가능, PROXY_ONLY: 대리인 + 읽기 불가, NONE: 대리인 아님)",
			example = "READ_WRITE",
			allowableValues = {"READ_WRITE", "PROXY_ONLY", "NONE"}
		)
		TrustAccessLevel accessLevel

	) {}
}
