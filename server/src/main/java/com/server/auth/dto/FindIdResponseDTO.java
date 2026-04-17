package com.server.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindIdResponseDTO {

  @Schema(description = "마스킹된 아이디", example = "hon****")
  private String loginId;
}
