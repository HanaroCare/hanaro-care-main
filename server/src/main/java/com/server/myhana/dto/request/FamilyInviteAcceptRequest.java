package com.server.myhana.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FamilyInviteAcceptRequest {
    @Schema(description = "가족 초대 JWT 토큰", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;
}
