package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CareType {
	HOME("01", "재가요양"),
	CENTER("02", "요양원"),
	HOSPITAL("03", "요양병원");

	private final String code;
	private final String description;
}
