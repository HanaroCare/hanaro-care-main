package com.server.asset.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Service;

@Service
public class NationalPensionService {

    public BigDecimal estimateMonthlyPension(int currentAge, BigDecimal monthlyIncome, int totalYears) {
        if (monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) == 0) {
            return new BigDecimal("350000");
        }

        BigDecimal replacementRate = new BigDecimal("0.4");
        BigDecimal durationWeight = new BigDecimal(totalYears).divide(new BigDecimal("20"), 2, RoundingMode.HALF_UP);
        
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
