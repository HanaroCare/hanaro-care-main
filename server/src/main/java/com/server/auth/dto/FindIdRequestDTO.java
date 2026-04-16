package com.server.auth.dto;

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
public class FindIdRequestDTO {

  @NotBlank(message = "이름은 필수 입력 사항입니다.")
  @Size(min = 1, max = 20, message = "이름은 1자 이상 20자 이하여야 합니다.")
  @Schema(description = "가입 시 등록한 이름", example = "홍길동")
  private String username;

  @NotBlank(message = "전화번호는 필수 입력 사항입니다.")
  @PhoneNumber
  @Schema(description = "가입 시 등록한 전화번호 (숫자만, 10~11자리)", example = "01011112222")
  private String phoneNumber;
}
