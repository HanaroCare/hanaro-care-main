package com.server.asset.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

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

    /**
     * 월 연금 수령액 추정
     * 1순위: TB_ACCOUNT에서 PENSION 카테고리 PAY_AMT 합산
     * 2순위: 통계 기반 추정
     */
    public BigDecimal estimateMonthlyPension(Long userId, int currentAge, BigDecimal monthlyIncome, int totalYears) {
        // 1. DB에서 실제 연금 데이터 조회
        try {
            List<TBAccount> pensionAccounts = accountRepository
                .findByUser_UserIdAndAssetCateCd(userId, AssetCategory.PENSION);

            BigDecimal totalPension = pensionAccounts.stream()
                .filter(account -> account.getPayAmt() != null
                    && account.getPayAmt().compareTo(BigDecimal.ZERO) > 0)
                .map(TBAccount::getPayAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalPension.compareTo(BigDecimal.ZERO) > 0) {
                log.info("[연금 조회] DB 실제 연금 데이터 - 월 수령액: {}원", totalPension);
                return totalPension;
            }
        } catch (Exception e) {
            log.warn("[연금 조회] DB 조회 실패, 통계 추정으로 전환: {}", e.getMessage());
        }

        // 2. 통계 기반 추정 (DB 데이터 없을 때)
        log.info("[연금 조회] DB 데이터 없음 - 통계 기반 추정값 사용");
        return estimateByStatistics(currentAge, monthlyIncome, totalYears);
    }

    // 통계 기반 국민연금 최저 추정액 (2024년 기준 평균 수급액 약 65만원)
    private static final BigDecimal MIN_PENSION = new BigDecimal("650000");
    // 통계 기반 국민연금 평균 추정액 (가입 이력 있는 일반적인 수급자 기준)
    private static final BigDecimal AVG_PENSION = new BigDecimal("650000");

    private BigDecimal estimateByStatistics(int currentAge, BigDecimal monthlyIncome, int totalYears) {
        // monthlyIncome이 지출 데이터이거나 너무 낮으면 평균 연금으로 대체
        if (monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) == 0
                || monthlyIncome.compareTo(new BigDecimal("500000")) < 0) {
            log.info("[연금 추정] 소득 데이터 부족 - 통계 평균 연금 사용: {}원", AVG_PENSION);
            return AVG_PENSION;
        }

        // 소득 대체율 40%, 가입 기간 가중치 적용
        BigDecimal replacementRate = new BigDecimal("0.4");
        BigDecimal durationWeight = new BigDecimal(totalYears)
            .divide(new BigDecimal("20"), 2, RoundingMode.HALF_UP)
            .min(new BigDecimal("1.5")); // 최대 1.5배 상한

        BigDecimal estimatedAmt = monthlyIncome
            .multiply(replacementRate)
            .multiply(durationWeight);

        int yearsToRetire = 65 - currentAge;
        if (yearsToRetire > 0) {
            double inflation = Math.pow(1.02, yearsToRetire);
            estimatedAmt = estimatedAmt.multiply(BigDecimal.valueOf(inflation));
        }

        BigDecimal result = estimatedAmt.setScale(0, RoundingMode.HALF_UP);
        // 최저 하한선 적용
        return result.compareTo(MIN_PENSION) < 0 ? MIN_PENSION : result;
    }
}
