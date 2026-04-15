package com.server.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnlockDormantRequestDTO {

  @NotBlank(message = "아이디는 필수 입력 사항입니다.")
  @Schema(description = "로그인 아이디", example = "younghee9")
  // @LoginId
  private String loginId;

  @NotBlank(message = "새 비밀번호는 필수 입력 사항입니다.")
  // @Password
  @Schema(description = "변경할 새 비밀번호", example = "newPassword123")
  private String newUserPwd;
}
