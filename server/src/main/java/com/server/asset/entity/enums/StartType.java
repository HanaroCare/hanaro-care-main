package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StartType {
	NOW("01", "지금"),
	SCHEDULED("02", "아플때");

	private final String code;
	private final String description;
}
