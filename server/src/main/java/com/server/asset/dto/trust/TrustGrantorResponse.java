package com.server.asset.dto.trust;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "신탁 조회 가능한 부모(grantor) 목록 응답")
public record TrustGrantorResponse(
	@Schema(description = "신탁 조회 권한이 있는 가족 목록")
	List<GrantorItem> grantors
) {
	public record GrantorItem(
		@Schema(description = "부모(grantor) userId", example = "1001")
		Long grantorId,

		@Schema(description = "부모 이름", example = "홍길동")
		String grantorName,

		@Schema(description = "관계 코드", example = "PARENT")
		String relation,

		@Schema(description = "관계 한글 라벨", example = "부모")
		String relationLabel
	) {}
}
