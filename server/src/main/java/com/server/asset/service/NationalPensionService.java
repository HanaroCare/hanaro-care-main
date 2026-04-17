package com.server.asset.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.server.asset.dto.simulation.PensionEstimationResult;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.AccountRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NationalPensionService {

    private final AccountRepository accountRepository;
    private static final BigDecimal MIN_PENSION = new BigDecimal("650000");

    public PensionEstimationResult estimateMonthlyPension(Long userId, int currentAge, BigDecimal monthlyIncome, int contributionYears, boolean isExpense) {

        // 1. DB에서 사용자의 연금 계좌 조회
        List<TBAccount> pensionAccounts = accountRepository
            .findByUser_UserIdAndAssetCateCd(userId, AssetCategory.PENSION_NATIONAL);

        // 2. 하나라도 연동(IS_LINKED=1)된 계좌가 있는지 확인
        boolean isLinked = pensionAccounts.stream().anyMatch(TBAccount::getIsLinked);

        // 3. 연동된 계좌의 수령액(PAY_AMT) 합산
        BigDecimal linkedTotal = pensionAccounts.stream()
            .filter(acc -> acc.getIsLinked() && acc.getPayAmt() != null)
            .map(TBAccount::getPayAmt)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. 결과 도출
        BigDecimal finalAmount;
        if (isLinked && linkedTotal.compareTo(BigDecimal.ZERO) > 0) {
            log.info("[연금] 사용자 {} : 연동 데이터 기반 계산", userId);
            finalAmount = linkedTotal.compareTo(MIN_PENSION) < 0 ? MIN_PENSION : linkedTotal;
        } else {
            log.warn("[연금] 사용자 {} : 연동 데이터 없음, 통계치 적용 (연동 유도 타겟)", userId);
            finalAmount = computeUnlinkedEstimation(monthlyIncome, isExpense);
        }

        return new PensionEstimationResult(finalAmount, isLinked);
    }

    private BigDecimal computeUnlinkedEstimation(BigDecimal monthlyIncome, boolean isExpense) {
        // 지출 데이터를 소득으로 오해하지 않도록 차단
        if (isExpense || monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        // 연동 안 한 사용자에게 보여줄 '위기감 조성용' 낮은 추정치
        return new BigDecimal("450000");
    }
}
