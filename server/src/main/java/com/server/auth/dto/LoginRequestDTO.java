package com.server.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
  @Schema(description = "사용자 아이디(이름)", example = "testUser")
  private String userNm;

  @NotBlank(message = "비밀번호는 필수 입력 사항입니다.")
  @Schema(description = "사용자 비밀번호", example = "12345678")
  private String userPwd;
}
