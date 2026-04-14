package com.server.simulation.dto.ai;

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

    // 사용자 기본 정보
    private Long userId;
    private Integer userAge;
    private String userAddr; // 거주지

    // 선택된 시뮬레이션 설정
    private Integer targetAge;
    private CareType careType;

    // 마이데이터(가공) 기반 소비 패턴
    private BigDecimal averageMonthlySpending; // 월평균 소비액
    private Map<String, BigDecimal> spendingByCategory; // 카테고리별 소비 비중

    // 자산 정보 (시뮬레이션에 필요할 수 있음)
    private BigDecimal totalAssetAmt;
}
