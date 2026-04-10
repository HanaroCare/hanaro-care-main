package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RealAssetCategory {
	REAL_ESTATE("01", "부동산"),
	VEHICLE("02", "자동차"),
	GOLD("03", "금");

	private final String code;
	private final String description;
}
