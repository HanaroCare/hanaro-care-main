package com.server.asset.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.server.asset.dto.dashboard.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.dashboard.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.dashboard.AssetDetailResponse;
import com.server.asset.dto.dashboard.FinancialAssetResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.AssetCategory;

@Mapper(componentModel = "spring")
public interface AssetMapper {
    FinancialAssetResponse toFinancialAssetResponse(TBAccount account);
    List<FinancialAssetResponse> toFinancialAssetResponseList(List<TBAccount> accounts);

    // TBRealAsset -> 공통 DTO
    @Mapping(target = "assetId", source = "realAssetId")
    @Mapping(target = "amount", source = "evalAmt")
    @Mapping(target = "instNm", ignore = true)
    @Mapping(target = "monthlyPremAmt", ignore = true)
    @Mapping(target = "expireDt", ignore = true)
    AssetDetailResponse toAssetDetailResponse(TBRealAsset asset);

    // TBAccount -> 공통 DTO
    @Mapping(target = "assetId", source = "accountId")
    @Mapping(target = "assetNm", source = "accountNm")
    @Mapping(target = "amount", source = "balanceAmt")
    @Mapping(target = "addr", ignore = true)
    @Mapping(target = "assetSize", ignore = true)
    @Mapping(target = "assetDesc", ignore = true)
    AssetDetailResponse toAssetDetailResponse(TBAccount account);

    List<AssetDetailResponse> toAssetDetailListFromReal(List<TBRealAsset> assets);
    List<AssetDetailResponse> toAssetDetailListFromAccount(List<TBAccount> accounts);

    default FinancialAssetSummary toFinancialAssetSummary(Object[] row) {
        if (row == null || row.length < 2) return null;
        return FinancialAssetSummary.builder()
            .assetCateCd((AssetCategory) row[0])
            .totalBalance((BigDecimal) row[1])
            .build();
    }

    @Mapping(target = "realAssetId", source = "realAssetId")
    @Mapping(target = "evalAmt", source = "evalAmt")
    RealAssetSummary toRealAssetSummary(TBRealAsset asset);

    List<RealAssetSummary> toRealAssetSummaryListFromEntity(List<TBRealAsset> assets);
    List<FinancialAssetSummary> toFinancialAssetSummaryList(List<Object[]> rows);
}
