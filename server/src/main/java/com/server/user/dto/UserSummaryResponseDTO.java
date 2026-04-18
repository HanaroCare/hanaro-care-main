package com.server.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "유저 목록 응답 DTO (가족 매칭용)")
public class UserSummaryResponseDTO {

  @Schema(description = "유저 ID", example = "1001")
  private String userId;

  @Schema(description = "로그인 아이디", example = "hong1234")
  private String loginId;

  @Schema(description = "사용자 이름", example = "홍길동")
  private String userNm;

  @Schema(description = "전화번호 (가운데 4자리 마스킹)", example = "010****2222")
  private String userPhone;

  @Schema(description = "하나 인증 여부", example = "true")
  private Boolean isHanaCert;
}
