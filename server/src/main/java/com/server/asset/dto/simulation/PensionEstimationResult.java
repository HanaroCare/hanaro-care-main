package com.server.asset.dto.simulation;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PensionEstimationResult {
	private final BigDecimal amount;
	private final boolean isLinked;
}
