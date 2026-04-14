package com.server.asset.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.dto.response.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.response.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.repository.TBAccountRepository;
import com.server.asset.repository.TBRealAssetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

	private final TBAccountRepository tbAccountRepository;
	private final TBRealAssetRepository tbRealAssetRepository;

	public AssetDashboardResponse getAssetDashboard(Long userId) {
		BigDecimal totalFinancialAmt = tbAccountRepository.findTotalBalanceByUserId(userId);
		if (totalFinancialAmt == null) {
			totalFinancialAmt = BigDecimal.ZERO;
		}

		List<FinancialAssetSummary> financialAssets = tbAccountRepository
			.findBalanceSumGroupByCategoryByUserId(userId)
			.stream()
			.map(row -> FinancialAssetSummary.builder()
				.assetCateCd((AssetCategory) row[0])
				.totalBalance((BigDecimal) row[1])
				.build())
			.toList();

		List<RealAssetSummary> realAssets = tbRealAssetRepository
			.findEvalAmtSumGroupByCategoryByUserId(userId)
			.stream()
			.map(row -> RealAssetSummary.builder()
				.assetCateCd((RealAssetCategory) row[0])
				.totalValue((BigDecimal) row[1])
				.build())
			.toList();

		return AssetDashboardResponse.builder()
			.totalFinancialAmt(totalFinancialAmt)
			.financialAssets(financialAssets)
			.realAssets(realAssets)
			.build();
	}
}
