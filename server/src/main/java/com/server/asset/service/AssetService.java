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
		// 1. 금융 자산 총액 조회
		BigDecimal totalFinancialAmt = tbAccountRepository.findTotalBalanceByUserId(userId);
		totalFinancialAmt = (totalFinancialAmt != null) ? totalFinancialAmt : BigDecimal.ZERO;

		// 2. 금융 자산 카테고리별 합계 (차트용 - 기존 유지)
		List<FinancialAssetSummary> financialAssets = assetMapper.toFinancialAssetSummaryList(
			tbAccountRepository.findBalanceSumGroupByCategoryByUserId(userId)
		);

		// 3. 실물 자산 상세 리스트 (카드 리스트용 - 수정)
		// findEvalAmtSumGroupByCategory... 대신 findAllByUserId... 사용
		List<RealAssetSummary> realAssets = assetMapper.toRealAssetSummaryListFromEntity(
			tbRealAssetRepository.findAllByUser_UserId(userId)
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
			tbAccountRepository.findByUser_UserIdAndAssetCateCd(userId, AssetCategory.INSURANCE)
		);
	}

	@CheckUser(key = "#userId")
	public List<AssetDetailResponse> getGoldAssets(Long userId) {
		return assetMapper.toAssetDetailListFromReal(
			tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.GOLD)
		);
	}
}
