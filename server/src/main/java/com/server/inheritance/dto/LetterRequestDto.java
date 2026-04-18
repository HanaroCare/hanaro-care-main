package com.server.inheritance.dto;

import com.server.inheritance.dto.validatior.ValidLetterRequest;
import com.server.inheritance.enums.LetterType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ValidLetterRequest
public class LetterRequestDto {

  @NotNull(message = "상속 상세 ID는 필수입니다.")
  @Schema(description = "상속 상세 ID", example = "3")
  private String inheritDetailId;

  @NotNull(message = "편지 타입은 필수입니다.")
  @Schema(description = "편지 타입", example = "WRITING")
  private LetterType letterTypeCd;

  @Schema(description = "편지 내용", example = "사랑하는 자녀에게...")
  private String letterCont;
}
