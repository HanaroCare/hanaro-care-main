package com.server.inheritance.dto;

import com.server.inheritance.enums.LetterType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class LetterResponseDto {

  private String letterCont;
  private String voiceUrl;
  private LetterType letterTypeCd;

}
