package com.server.myhana.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FamilyMemberResponse {
    @Schema(description = "사용자 고유 식별자", example = "1001")
    private Long userId;
    @Schema(description = "사용자 이름", example = "권하나")
    private String name;
    @Schema(description = "휴대폰 번호", example = "010-1234-5678")
    private String phone;
    @Schema(description = "가족 관계 (한글 명칭)", example = "자녀")
    private String relation;
    @Schema(description = "보험 공유 여부", example = "true")
    private Boolean isSharing;
    @Schema(description = "본인 여부", example = "true")
    private Boolean isMe;
}
