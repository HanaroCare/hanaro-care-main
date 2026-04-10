package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransStatCd {
	COMPLETED("01", "완료"),
	IN_PROGRESS("02", "진행중"),
	FAILED("03", "실패");

	private final String code;
	private final String description;
}
