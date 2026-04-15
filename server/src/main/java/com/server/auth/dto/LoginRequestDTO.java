package com.server.auth.dto;

import com.server.common.validator.LoginId;
import com.server.user.enums.LoginMeans;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class LoginRequestDTO {

  @NotBlank(message = "아이디는 필수 입력 사항입니다.")
  @LoginId
  @Schema(description = "로그인 아이디", example = "testUser")
  private String loginId;

  /**
   * 인증 수단.
   */
  @NotNull(message = "인증 수단은 필수 입력 사항입니다.")
  @Schema(
      description = "인증 수단 (PASSWORD: 일반, SIMPLE_PASSWORD: 간편번호, PATTERN: 패턴, FACEID: 생체)",
      example = "PASSWORD"
  )
  private LoginMeans means;

  /**
   * 인증 값
   */
  @NotBlank(message = "인증 값은 필수 입력 사항입니다.")
  @Schema(description = "인증 수단에 해당하는 값 (일반: 영숫자 비밀번호, 간편: 숫자 6자리)", example = "test1234")
  private String userPwd;
}
