package com.server.asset.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.dto.response.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.response.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.response.AssetDetailResponse;
import com.server.asset.dto.response.FinancialAssetResponse;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.mapper.AssetMapper;
import com.server.asset.repository.TBAccountRepository;
import com.server.asset.repository.TBRealAssetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

	private final TBAccountRepository tbAccountRepository;
	private final TBRealAssetRepository tbRealAssetRepository;
	private final AssetMapper assetMapper;


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

	public List<FinancialAssetResponse> getFinancialAssets(Long userId) {
		return assetMapper.toFinancialAssetResponseList(tbAccountRepository.findAllByUser_UserId(userId));
	}

	public List<AssetDetailResponse> getRealEstateAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.REAL_ESTATE)
		);
	}

	public List<AssetDetailResponse> getVehicleAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.VEHICLE)
		);
	}

	public List<AssetDetailResponse> getInsuranceAssets(Long userId) {
		return assetMapper.toAssetDetailListFromAccount(
			tbAccountRepository.findAllByUser_UserIdAndAssetCateCd(userId, AssetCategory.INSURANCE)
		);
	}

	public List<AssetDetailResponse> getGoldAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.GOLD)
		);
	}
}
