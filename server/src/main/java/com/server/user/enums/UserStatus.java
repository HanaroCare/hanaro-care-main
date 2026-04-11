package com.server.user.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
  ACTIVE("01", "활동"),
  SUSPENDED("02", "정지"),
  DORMANT("03", "휴면");

  private final String code;
  private final String description;
}


