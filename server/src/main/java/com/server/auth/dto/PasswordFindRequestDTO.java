package com.server.auth.dto;

import com.server.common.validator.LoginId;
import com.server.common.validator.PhoneNumber;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordFindRequestDTO {

  @NotBlank(message = "아이디는 필수 입력 사항입니다.")
  @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하여야 합니다.")
  @LoginId
  @Schema(description = "가입 시 등록한 아이디", example = "hong123")
  private String loginId;

  @NotBlank(message = "전화번호는 필수 입력 사항입니다.")
  @PhoneNumber
  @Schema(description = "가입 시 등록한 전화번호 (숫자만, 10~11자리)", example = "01011112222")
  private String userPhone;
}
