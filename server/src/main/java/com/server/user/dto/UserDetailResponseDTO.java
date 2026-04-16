package com.server.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "유저 상세 응답 DTO")
public class UserDetailResponseDTO {

  @Schema(description = "유저 ID", example = "1001")
  private Long userId;

  @Schema(description = "로그인 아이디", example = "hong1234")
  private String loginId;

  @Schema(description = "사용자 이름", example = "홍길동")
  private String userNm;

  @Schema(description = "나이", example = "65")
  private Integer userAge;

  @Schema(description = "전화번호", example = "01011112222")
  private String userPhone;

  @Schema(description = "하나 인증 여부", example = "true")
  private Boolean isHanaCert;

  @Schema(description = "사용자 역할", example = "ROLE_USER")
  private String userRole;

  @Schema(description = "계정 상태", example = "ACTIVE")
  private String userStatusCd;

  @Schema(description = "마지막 로그인 일시", example = "2026-04-15T10:30:00")
  private LocalDateTime lastLoginAt;
}
