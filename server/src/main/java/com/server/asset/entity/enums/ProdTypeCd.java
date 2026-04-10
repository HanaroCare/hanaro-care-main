package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProdTypeCd {
	HOUSING_PENSION("01", "주택연금"),
	TRUST("02", "신탁");

	private final String code;
	private final String description;
}
