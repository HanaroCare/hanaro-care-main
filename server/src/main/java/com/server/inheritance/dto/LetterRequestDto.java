package com.server.inheritance.dto;

import com.server.inheritance.enums.LetterType;
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
  private Long familyId;
  private LetterType LetterTypeCd;
  private String letterCont;
  private MultipartFile voice;
}
