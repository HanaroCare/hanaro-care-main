package com.server.asset.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.mapstruct.Mapper;

import com.server.asset.dto.response.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.response.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.response.FinancialAssetResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;

@Mapper(componentModel = "spring")
public interface AssetMapper {
    FinancialAssetResponse toFinancialAssetResponse(TBAccount account);
    List<FinancialAssetResponse> toFinancialAssetResponseList(List<TBAccount> accounts);

    default FinancialAssetSummary toFinancialAssetSummary(Object[] row) {
        if (row == null || row.length < 2) return null;
        return FinancialAssetSummary.builder()
            .assetCateCd((AssetCategory) row[0])
            .totalBalance((BigDecimal) row[1])
            .build();
    }

    default RealAssetSummary toRealAssetSummary(Object[] row) {
        if (row == null || row.length < 2) return null;
        return RealAssetSummary.builder()
            .assetCateCd((RealAssetCategory) row[0])
            .totalValue((BigDecimal) row[1])
            .build();
    }

    List<FinancialAssetSummary> toFinancialAssetSummaryList(List<Object[]> rows);
    List<RealAssetSummary> toRealAssetSummaryList(List<Object[]> rows);
}
