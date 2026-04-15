package com.server.auth.dto;

import com.server.common.validator.PhoneNumber;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmsRequestDTO {

  @NotBlank(message = "전화번호는 필수 입력 사항입니다.")
  @PhoneNumber
  @Schema(description = "전화번호 (숫자만, 10~11자리)", example = "01012345678")
  private String phone;
}
