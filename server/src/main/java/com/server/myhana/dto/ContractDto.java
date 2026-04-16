package com.server.myhana.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContractDto {

  @NotBlank
  @Schema(description = "사용자 이름", example = "홍길동")
  private String userName;

  @NotBlank
  @Schema(description = "사용자 전화번호", example = "010-1234-5678")
  private String userPhone;

  @NotBlank
  @Schema(description = "임의후견인으로 지정할 성명", example = "홍말동")
  private String guardianName;

  @NotBlank
  @Schema(description = "임의후견인과의 관계", example = "자녀")
  private String guardianRelation;

  @NotNull
  @Size(min = 5, max = 5)
  @Schema(
      description = "후견인 권한 (재산 관리, 의료 결정, 요양 시설 계약, 계약 체결, 법적 대리 순서, true=○ false=□)",
      example = "[true, true, false, true, false]"
  )
  private boolean[] permission = new boolean[5];

}
