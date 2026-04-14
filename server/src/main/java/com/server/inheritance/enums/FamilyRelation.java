package com.server.inheritance.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum FamilyRelation {
  SPOUSE("01", "배우자"),
  CHILD("02", "자녀"),
  PARENT("03", "부모"),
  FAMILY("04", "가족"),
  OTHER("05", "기타");

  private final String code;
  private final String description;
}
