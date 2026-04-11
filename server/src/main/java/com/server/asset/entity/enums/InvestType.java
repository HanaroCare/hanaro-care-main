package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InvestType {
	LUMP_SUM("01", "일임형"),
	DIRECT("02", "직접운용");

	private final String code;
	private final String description;
}
