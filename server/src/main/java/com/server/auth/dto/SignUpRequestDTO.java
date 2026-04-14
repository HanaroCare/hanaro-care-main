package com.server.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequestDTO {

  @NotBlank(message = "아이디는 필수 입력 사항입니다.")
  @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하로 입력해주세요.")
  @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "아이디는 영문자와 숫자만 사용할 수 있습니다.")
  @Schema(description = "로그인 아이디 (영문/숫자)", example = "testUser01")
  private String loginId;

  @NotBlank(message = "이름은 필수 입력 사항입니다.")
  @Size(min = 2, max = 20, message = "이름은 2자 이상 20자 이하로 입력해주세요.")
  @Schema(description = "사용자 실명", example = "홍길동")
  private String userNm;

  @NotNull(message = "나이는 필수 입력 사항입니다.")
  @Min(value = 1, message = "나이는 1 이상이어야 합니다.")
  @Max(value = 150, message = "올바른 나이를 입력해주세요.")
  @Schema(description = "사용자 나이", example = "30")
  private Integer userAge;

  @NotBlank(message = "전화번호는 필수 입력 사항입니다.")
  @Pattern(regexp = "^\\d{10,11}$", message = "전화번호는 10~11자리 숫자여야 합니다.")
  @Schema(description = "전화번호 (숫자만, 10~11자리)", example = "01012345678")
  private String userPhone;

  @NotBlank(message = "비밀번호는 필수 입력 사항입니다.")
  @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해주세요.")
  @Schema(description = "비밀번호", example = "password123")
  private String userPwd;
}
