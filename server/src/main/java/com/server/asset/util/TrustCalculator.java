package com.server.asset.util;

import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.entity.enums.InvestType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;

public final class TrustCalculator {

  public static final BigDecimal MANAGED_ANNUAL_RATE = new BigDecimal("0.0425"); // 일임형
  public static final BigDecimal SELF_ANNUAL_RATE    = new BigDecimal("0.035");  // 직접운용
  public static final BigDecimal TAX_RATE            = new BigDecimal("0.154");  // 세금
  public static final int        DEFAULT_PERIOD_YEARS = 5; // 신탁 설계 기본 기준

  private TrustCalculator() {}

  public static BigDecimal resolveAnnualRate(InvestType investType) {
    InvestType resolved = java.util.Objects.requireNonNull(investType, "investType must not be null");
    return resolved == InvestType.LUMP_SUM ? MANAGED_ANNUAL_RATE : SELF_ANNUAL_RATE;
  }

  // 신탁 설계(시뮬레이션) 상세 계산
  public static SimulationDetailDto calculateDetail(BigDecimal principal, BigDecimal annualRate) {
    BigDecimal profit    = calculateProfit(principal, annualRate, DEFAULT_PERIOD_YEARS);
    BigDecimal tax       = profit.multiply(TAX_RATE).setScale(0, RoundingMode.DOWN);
    BigDecimal netAmount = principal.add(profit).subtract(tax);

    BigDecimal profitRate = BigDecimal.ZERO;
    if (principal.compareTo(BigDecimal.ZERO) > 0) {
      profitRate = netAmount.subtract(principal)
          .divide(principal, 4, RoundingMode.DOWN)
          .multiply(BigDecimal.valueOf(100))
          .setScale(1, RoundingMode.DOWN);
    }

    return new SimulationDetailDto(principal, profit, tax, netAmount, profitRate);
  }

  public static BigDecimal calculateProfit(BigDecimal principal, BigDecimal annualRate, int years) {
    return principal.multiply(BigDecimal.ONE.add(annualRate).pow(years))
        .subtract(principal)
        .setScale(0, RoundingMode.DOWN);
  }

  //월별 집행 예정 금액 합계 (병원비 + 생활비)
  public static BigDecimal calculateMonthlyTotal(BigDecimal hospitalAmount, BigDecimal livingAmount) {
    return defaultIfNull(hospitalAmount).add(defaultIfNull(livingAmount));
  }

  //가입일로부터 현재까지 경과 월수 (시작월 포함)
  public static long calculateMonthsPassed(LocalDate startDate) {
    if (startDate == null) return 0;
    LocalDate today = LocalDate.now();
    if (startDate.isAfter(today)) return 0;
    long months = ChronoUnit.MONTHS.between(
        YearMonth.from(startDate),
        YearMonth.from(today)
    ) + 1;
    return Math.max(months, 0);
  }

  //총 누적 집행 금액 계산
  public static BigDecimal calculateTotalExecution(BigDecimal monthlyTotal, long monthsPassed) {
    return monthlyTotal.multiply(BigDecimal.valueOf(monthsPassed));
  }

  //현재 총 자산
  public static BigDecimal calculateCurrentAmount(BigDecimal principal, BigDecimal profit) {
    return defaultIfNull(principal).add(defaultIfNull(profit));
  }

  public static BigDecimal defaultIfNull(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }
}
