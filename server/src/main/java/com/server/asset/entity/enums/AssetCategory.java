package com.server.asset.entity.enums;

import java.util.EnumSet;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AssetCategory {
	CASH("01", "현금"),
	PENSION("02", "연금"),           // 주택연금 (기존 호환 유지)
	CARD("03", "카드"),
	INSURANCE("04", "보험"),
	STOCK("05", "주식"),
	PENSION_NATIONAL("06", "국민연금"),
	PENSION_RETIRE("07", "퇴직연금"),
	PENSION_PERSONAL("08", "개인연금");

	private final String code;
	private final String description;

	public boolean isPensionFamily() {
		return EnumSet.of(PENSION, PENSION_NATIONAL, PENSION_RETIRE, PENSION_PERSONAL)
			.contains(this);
	}
	}
