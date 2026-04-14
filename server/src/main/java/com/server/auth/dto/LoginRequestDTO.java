package com.server.auth.dto;

import com.server.user.enums.LoginMeans;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

  @NotBlank(message = "아이디는 필수 입력 사항입니다.")
  @Size(min = 2, max = 20, message = "아이디는 2자 이상 20자 이하로 입력해주세요.")
  @Schema(description = "사용자 아이디", example = "testUser")
  private String userNm;

  /**
   * 인증 수단.
   */
  @NotNull(message = "인증 수단은 필수 입력 사항입니다.")
  @Schema(
      description = "인증 수단 (PASSWORD: 일반, SIMPLE_PASSWORD: 간편번호, PATTERN: 패턴, FACEID: 생체)",
      example = "SIMPLE_PASSWORD"
  )
  private LoginMeans means;

  /**
   * 인증 값
   */
  @NotBlank(message = "인증 값은 필수 입력 사항입니다.")
  @Schema(description = "인증 수단에 해당하는 값", example = "password123!")
  private String userPwd;
}
