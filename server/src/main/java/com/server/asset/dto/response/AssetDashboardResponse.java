package com.server.asset.dto.response;

import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetDashboardResponse {
    private BigDecimal totalFinancialAmt;
    private List<FinancialAssetSummary> financialAssets;
    private List<RealAssetSummary> realAssets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FinancialAssetSummary {
        private AssetCategory assetCateCd;
        private BigDecimal totalBalance;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RealAssetSummary {
        private RealAssetCategory assetCateCd;
        private BigDecimal totalValue;
    }
}
