package com.server.myhana.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class FamilySummaryDto {

  @Schema(description = "사용자 이름", example = "홍말동")
  private String name;
  @Schema(description = "사용자 전화번호", example = "010-1234-5678")
  private String phoneNumber;
  @Schema(description = "관계", example = "자녀")
  private String relationCd;
}
