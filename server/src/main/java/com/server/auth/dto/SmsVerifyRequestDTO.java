package com.server.auth.dto;

import com.server.common.validator.PhoneNumber;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmsVerifyRequestDTO {

  @NotBlank(message = "전화번호는 필수 입력 사항입니다.")
  @PhoneNumber
  @Schema(description = "전화번호 (숫자만, 10~11자리)", example = "01012345678")
  private String phone;

  @NotBlank(message = "인증번호는 필수 입력 사항입니다.")
  @Size(min = 6, max = 6, message = "인증번호는 6자리여야 합니다.")
  @Pattern(regexp = "\\d{6}", message = "인증번호는 6자리 숫자여야 합니다.")
  @Schema(description = "수신한 6자리 인증번호", example = "123456")
  private String authCode;
}
