package com.server.asset.dto.external;

import java.math.BigDecimal;
import java.util.Map;

import com.server.asset.entity.enums.CareType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisInput {
    private Long userId;
    private Integer userAge;
    private String userAddr;
    private Integer targetAge;
    private CareType careType;
    private BigDecimal averageMonthlySpending;
    private Map<String, BigDecimal> spendingByCategory;
    private BigDecimal totalAssetAmt;
}
