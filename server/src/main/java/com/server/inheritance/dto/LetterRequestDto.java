package com.server.inheritance.dto;

import com.server.inheritance.enums.LetterType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LetterRequestDto {

  @NotBlank
  @Schema(description = "상속 상세 ID", example = "1")
  private Long familyId;

  @Schema(description = "편지 타입", example = "WRITING")
//  @Schema(description = "편지 타입", example = "VOICE")
  private LetterType LetterTypeCd;

  @Schema(description = "편지 내용", example = "사랑하는 가족에게...")
  private String letterCont;

  @Schema(description = "음성 파일 (VOICE 타입일 경우)")
//  @Schema(description = "음성 파일 (VOICE 타입일 경우, webm 형식)", type = "string", format = "binary")
  private MultipartFile voice;
}
