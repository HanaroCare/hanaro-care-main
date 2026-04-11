package com.server.inheritance.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum LetterType {
  WRITING("01", "글"), VOICE("02", "음성");

  private final String code;
  private final String description;
}
