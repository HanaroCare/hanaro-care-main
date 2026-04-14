package com.server.asset.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.server.asset.dto.response.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.response.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.response.FinancialAssetResponse;
import com.server.asset.entity.TBAccount;

@Mapper(componentModel = "spring")
public interface AssetMapper {
    FinancialAssetResponse toFinancialAssetResponse(TBAccount account);
    List<FinancialAssetResponse> toFinancialAssetResponseList(List<TBAccount> accounts);

    List<FinancialAssetSummary> toFinancialAssetSummaryList(List<Object[]> rows);
    List<RealAssetSummary> toRealAssetSummaryList(List<Object[]> rows);
}
