package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PensionPayoutType {
	FIXED("정액형"),
	FRONT_LOADED("초기증액형"),
	GROWING("정기증가형");

	private final String label;
}
