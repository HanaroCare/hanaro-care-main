package com.server.asset.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransType {
	PAYMENT("01", "지급"),
	INTEREST("02", "이자"),
	REPAYMENT("03", "상환");

	private final String code;
	private final String description;
}
