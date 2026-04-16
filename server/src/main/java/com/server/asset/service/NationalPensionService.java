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
     * @param contributionYears 실제 국민연금 납부/가입 예상 총 기간 (예: 10년, 20년)
     * @param isExpense 전달된 monthlyIncome 값이 소득이 아닌 '지출' 데이터인지 여부
     */
    public BigDecimal estimateMonthlyPension(Long userId, int currentAge, BigDecimal monthlyIncome, int contributionYears, boolean isExpense) {
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

        log.info("[연금 조회] DB 데이터 없음 - 통계 기반 추정값 사용 (isExpense: {})", isExpense);
        // 지적사항 반영: totalYears 대신 contributionYears 전달
        return estimateByStatistics(currentAge, monthlyIncome, contributionYears, isExpense);
    }

    private BigDecimal estimateByStatistics(int currentAge, BigDecimal monthlyIncome, int contributionYears, boolean isExpense) {
        if (isExpense || monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) == 0
            || monthlyIncome.compareTo(new BigDecimal("500000")) < 0) {
            log.info("[연금 추정] 소득 데이터가 아니거나 부족함 - 통계 평균 연금 사용: {}원", AVG_PENSION);
            return AVG_PENSION;
        }

        BigDecimal replacementRate = new BigDecimal("0.4");

        BigDecimal durationWeight = new BigDecimal(contributionYears)
            .divide(new BigDecimal("20"), 2, RoundingMode.HALF_UP)
            .min(new BigDecimal("1.5"));

        BigDecimal estimatedAmt = monthlyIncome
            .multiply(replacementRate)
            .multiply(durationWeight);

        int yearsToRetire = 65 - currentAge;
        if (yearsToRetire > 0) {
            double inflation = Math.pow(1.02, yearsToRetire);
            estimatedAmt = estimatedAmt.multiply(BigDecimal.valueOf(inflation));
        }

        BigDecimal result = estimatedAmt.setScale(0, RoundingMode.HALF_UP);
        return result.compareTo(MIN_PENSION) < 0 ? MIN_PENSION : result;
    }
}
