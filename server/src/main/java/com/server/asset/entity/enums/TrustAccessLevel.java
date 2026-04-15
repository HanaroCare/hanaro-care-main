package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TrustAccessLevel {
	READ_WRITE("01", "대리인 및 열람 권한 있음"),
	PROXY_ONLY("03", "대리인 권한만 있음"),
	NONE("04", "권한 없음");

	private final String code;
	private final String description;
}
