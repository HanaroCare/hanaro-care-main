package com.server.user.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@lombok.Getter
public enum FamilyRelation {
  SPOUSE("01", "배우자"),
  CHILD("02", "자녀"),
  PARENT("03", "부모"),
  FAMILY("04", "가족");

  private final String code;
  private final String description;
}
