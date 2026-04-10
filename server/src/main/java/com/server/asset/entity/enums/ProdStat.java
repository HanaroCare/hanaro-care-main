package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProdStat {
	IN_PROGRESS("01", "진행중"),
	CANCELLED("02", "해지"),
	EXPIRED("03", "만기");

	private final String code;
	private final String description;
}
