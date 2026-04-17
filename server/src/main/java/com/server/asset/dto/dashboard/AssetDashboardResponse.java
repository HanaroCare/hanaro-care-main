package com.server.asset.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;

import lombok.Builder;

@Builder
public record AssetDashboardResponse(
	boolean isMyDataLinked,
	BigDecimal totalFinancialAmt,
	List<FinancialAssetSummary> financialAssets,
	List<RealAssetSummary> realAssets
) {
	@Builder
	public record FinancialAssetSummary(
		AssetCategory assetCateCd,
		BigDecimal totalBalance
	) {}

	@Builder
	public record RealAssetSummary(
		String realAssetId,
		RealAssetCategory assetCateCd,
		String assetNm,
		BigDecimal evalAmt,
		BigDecimal assetSize,
		String addr,
		String assetDesc
	) {}
}
