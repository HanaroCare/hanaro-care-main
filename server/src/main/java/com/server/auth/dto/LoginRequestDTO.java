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
   * 인증 값 (means별 형식 상이) - PASSWORD: 영문+숫자조합 8~16자 - SIMPLE_PASSWORD: 숫자 6자리 - PATTERN: 숫자 4~9자리
   * FACEID: 비어있지 않은 토큰 문자열
   */
  @NotBlank(message = "인증 값은 필수 입력 사항입니다.")
  @Schema(
      description = """
          인증 수단별 입력 형식:
          PASSWORD → 영문+숫자 8~16자,
          SIMPLE_PASSWORD → 숫자 6자리,
          PATTERN → 숫자 4~9자리,
          FACEID → 비어있지 않은 토큰 문자열
          """,
      example = "test1234"
  )
  private String userPwd;
}
