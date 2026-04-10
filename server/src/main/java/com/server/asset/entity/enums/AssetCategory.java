package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AssetCategory {
	CASH("01", "현금"),
	PENSION("02", "연금"),
	CARD("03", "카드"),
	INSURANCE("04", "보험"),
	STOCK("05", "주식");

	private final String code;
	private final String description;
	}
