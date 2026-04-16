package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TrustType {
	HOSPITAL("01", "병원비"),
	LIVING("02", "생활비");

	private final String code;
	private final String description;
}
