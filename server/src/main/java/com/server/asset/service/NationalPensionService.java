package com.server.asset.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.TBAccountRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NationalPensionService {

    private final TBAccountRepository tbAccountRepository;

    /**
     * 월 연금 수령액 추정
     * 1순위: TB_ACCOUNT에서 PENSION 카테고리 PAY_AMT 합산
     * 2순위: 통계 기반 추정
     */
    public BigDecimal estimateMonthlyPension(Long userId, int currentAge, BigDecimal monthlyIncome, int totalYears) {
        // 1. DB에서 실제 연금 데이터 조회
        try {
            List<TBAccount> pensionAccounts = tbAccountRepository
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

    private BigDecimal estimateByStatistics(int currentAge, BigDecimal monthlyIncome, int totalYears) {
        if (monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) == 0) {
            return new BigDecimal("350000");
        }

        BigDecimal replacementRate = new BigDecimal("0.4");
        BigDecimal durationWeight = new BigDecimal(totalYears)
            .divide(new BigDecimal("20"), 2, RoundingMode.HALF_UP);

        BigDecimal estimatedAmt = monthlyIncome
            .multiply(replacementRate)
            .multiply(durationWeight);

        int yearsToRetire = 65 - currentAge;
        if (yearsToRetire > 0) {
            double inflation = Math.pow(1.02, yearsToRetire);
            estimatedAmt = estimatedAmt.multiply(BigDecimal.valueOf(inflation));
        }

        return estimatedAmt.setScale(0, RoundingMode.HALF_UP);
    }
}
