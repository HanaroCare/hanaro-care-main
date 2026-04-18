package com.server.myhana.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "가족 초대 수락 요청")
public class FamilyAcceptRequest {

  @Schema(description = "초대 토큰 (JWT)", required = true)
  private String inviteToken;
}
