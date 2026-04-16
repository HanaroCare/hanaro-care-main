package com.server.asset.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetSummaryDTO {
    private BigDecimal savingsAndDeposits; // 예적금 (CASH)
    private BigDecimal stocksAndFunds;      // 주식/펀드 (STOCK)
    private BigDecimal pensions;             // 연금 (PENSION)
    private BigDecimal realEstate;          // 부동산 (REAL_ESTATE)
    private BigDecimal otherAssets;          // 기타 (GOLD, VEHICLE 등)
    private BigDecimal totalAsset;

    public static AssetSummaryDTO empty() {
        return new AssetSummaryDTO(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
    }
}
