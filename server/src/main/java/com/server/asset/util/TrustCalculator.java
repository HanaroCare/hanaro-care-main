package com.server.asset.util;

import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.entity.enums.InvestType;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class TrustCalculator {

  public static final BigDecimal MANAGED_ANNUAL_RATE = new BigDecimal("0.0425"); // 일임형
  public static final BigDecimal SELF_ANNUAL_RATE    = new BigDecimal("0.035"); // 직접운용
  public static final BigDecimal TAX_RATE            = new BigDecimal("0.154"); // 세금
  public static final int        DEFAULT_PERIOD_YEARS = 5; // 신탁 설계 기본 기준

  private TrustCalculator() {}

  public static BigDecimal resolveAnnualRate(InvestType investType) {
    return investType == InvestType.LUMP_SUM ? MANAGED_ANNUAL_RATE : SELF_ANNUAL_RATE;
  }

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

  public static BigDecimal defaultIfNull(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }
}
