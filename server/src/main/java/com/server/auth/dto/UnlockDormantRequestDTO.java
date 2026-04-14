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
public class UnlockDormantRequestDTO {

  @NotBlank(message = "아이디는 필수 입력 사항입니다.")
  @Schema(description = "로그인 아이디", example = "testUser01")
  private String loginId;

  @NotBlank(message = "새 비밀번호는 필수 입력 사항입니다.")
  @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해주세요.")
  @Schema(description = "변경할 새 비밀번호", example = "newPassword123")
  private String newUserPwd;
}
