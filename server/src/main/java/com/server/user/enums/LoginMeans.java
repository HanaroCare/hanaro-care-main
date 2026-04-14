package com.server.user.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum LoginMeans {
  PASSWORD("00", "일반 비밀번호"),
  FACEID("01", "생체인증(FaceID)"),
  PATTERN("02", "패턴"),
  SIMPLE_PASSWORD("03", "간편 비밀번호");

  private final String code;
  private final String description;
}
