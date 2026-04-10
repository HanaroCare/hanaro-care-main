package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PayoutTypeCd {
	FLEXIBLE("01", "자유형"),
	PENSION("02", "연금");

	private final String code;
	private final String description;
}
