package com.server.inheritance.dto;

import com.server.inheritance.enums.LetterType;
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
public class LetterRequestDto {

  private Long familyId;
  private LetterType LetterTypeCd;
  private String letterCont;
  private String voiceUrl;
}
