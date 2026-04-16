package com.server.card.dto.response;

import com.server.user.entity.TBFamilyAuth;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FamilyMemberResponse {

  @Schema(description = "가족 권한 ID")
  private String familyAuthId;

  @Schema(description = "가족 유저 ID")
  private String granteeId;

  @Schema(description = "가족 이름")
  private String userNm;

  @Schema(description = "관계")
  private String relationCd;

  public static FamilyMemberResponse from(TBFamilyAuth auth) {
    return FamilyMemberResponse.builder()
        .familyAuthId(String.valueOf(auth.getFamilyAuthId()))
        .granteeId(String.valueOf(auth.getGrantee().getUserId()))
        .userNm(auth.getGrantee().getUserNm())
        .relationCd(auth.getRelationCd().name())
        .build();
  }
}
