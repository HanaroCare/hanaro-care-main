package com.server.asset.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.dto.dashboard.AssetDashboardResponse;
import com.server.asset.dto.dashboard.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.dashboard.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.dashboard.AssetDetailResponse;
import com.server.asset.dto.dashboard.FinancialAssetResponse;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.mapper.AssetMapper;
import com.server.asset.repository.TBAccountRepository;
import com.server.asset.repository.TBRealAssetRepository;
import com.server.common.annotation.CheckUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

	private final TBAccountRepository tbAccountRepository;
	private final TBRealAssetRepository tbRealAssetRepository;
	private final AssetMapper assetMapper;

	@CheckUser(key = "#userId")
	public AssetDashboardResponse getAssetDashboard(Long userId) {
		BigDecimal totalFinancialAmt = tbAccountRepository.findTotalBalanceByUserId(userId);
		totalFinancialAmt = (totalFinancialAmt != null) ? totalFinancialAmt : BigDecimal.ZERO;

		List<FinancialAssetSummary> financialAssets = assetMapper.toFinancialAssetSummaryList(
			tbAccountRepository.findBalanceSumGroupByCategoryByUserId(userId)
		);

		List<RealAssetSummary> realAssets = assetMapper.toRealAssetSummaryList(
			tbRealAssetRepository.findEvalAmtSumGroupByCategoryByUserId(userId)
		);

		return AssetDashboardResponse.builder()
			.totalFinancialAmt(totalFinancialAmt)
			.financialAssets(financialAssets)
			.realAssets(realAssets)
			.build();
	}

	@CheckUser(key = "#userId")
	public List<FinancialAssetResponse> getFinancialAssets(Long userId) {
		return assetMapper.toFinancialAssetResponseList(
			tbAccountRepository.findAllByUser_UserIdAndAssetCateCdNot(userId, AssetCategory.INSURANCE)
		);
	}

	@CheckUser(key = "#userId")
	public List<AssetDetailResponse> getRealEstateAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.REAL_ESTATE)
		);
	}

	@CheckUser(key = "#userId")
	public List<AssetDetailResponse> getVehicleAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.VEHICLE)
		);
	}

	@CheckUser(key = "#userId")
	public List<AssetDetailResponse> getInsuranceAssets(Long userId) {
		return assetMapper.toAssetDetailListFromAccount(
			tbAccountRepository.findAllByUser_UserIdAndAssetCateCd(userId, AssetCategory.INSURANCE)
		);
	}

	@CheckUser(key = "#userId")
	public List<AssetDetailResponse> getGoldAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.GOLD)
		);
	}
}
