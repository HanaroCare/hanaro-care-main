package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PensionPayoutType {
  FIXED("01", "정액형"),
  FRONT_LOADED("02", "초기증액형"),
  GROWING("03", "정기증가형");

  private final String code;
  private final String description;
}
