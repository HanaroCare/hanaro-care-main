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
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.mapper.AssetMapper;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.RealAssetRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

	private final AccountRepository accountRepository;
	private final RealAssetRepository realAssetRepository;
	private final AssetMapper assetMapper;
	private final SimulationRefreshService simulationRefreshService;

	@CheckUser(key = "#userId")
	public AssetDashboardResponse getAssetDashboard(Long userId) {
		boolean isMyDataLinked = accountRepository.existsByUser_UserIdAndIsLinkedTrue(userId);

		BigDecimal totalFinancialAmt = accountRepository.findTotalBalanceByUserIdAndIsLinkedTrue(userId);
		totalFinancialAmt = (totalFinancialAmt != null) ? totalFinancialAmt : BigDecimal.ZERO;

		List<FinancialAssetSummary> financialAssets = assetMapper.toFinancialAssetSummaryList(
			accountRepository.findBalanceSumGroupByCategoryByUserIdAndIsLinkedTrue(userId)
		);

		List<RealAssetSummary> realAssets = assetMapper.toRealAssetSummaryListFromEntity(
			realAssetRepository.findAllByUser_UserId(userId)
		);

		return assetMapper.toAssetDashboardResponse(
			isMyDataLinked,
			totalFinancialAmt,
			financialAssets,
			realAssets
		);
	}

  @Transactional
  @CheckUser(key = "#userId")
  public void updateAssetLinkStatus(Long userId, List<Long> accountIds) {
    List<TBAccount> userAccounts = accountRepository.findAllByUser_UserId(
        userId);

    userAccounts.forEach(account -> {
      boolean isLinked = accountIds.contains(account.getAccountId());
      account.setIsLinked(isLinked);
    });

    simulationRefreshService.enqueue(userId);
  }

  @CheckUser(key = "#userId")
  public List<FinancialAssetResponse> getFinancialAssets(Long userId) {
    return assetMapper.toFinancialAssetResponseList(
        accountRepository.findAllByUser_UserIdAndAssetCateCdNotAndIsLinkedTrue(userId,
            AssetCategory.INSURANCE)
    );
  }

	@CheckUser(key = "#userId")
	public AssetDetailResponse getRealAssetDetail(Long userId, Long realAssetId) {
		return realAssetRepository.findByRealAssetIdAndUser_UserId(realAssetId, userId)
			.map(assetMapper::toAssetDetailFromRealEntity)
			.orElseThrow(() -> new ApiException(ErrorStatus.ASSET_NOT_FOUND));
	}

	@CheckUser(key = "#userId")
	public List<AssetDetailResponse> getInsuranceAssets(Long userId) {
		// 기존 findByUser_UserIdAndAssetCateCd 대신 연동 여부(IsLinkedTrue)를 체크하는 메서드 호출
		return assetMapper.toAssetDetailListFromAccount(
			accountRepository.findByUser_UserIdAndAssetCateCdAndIsLinkedTrue(userId, AssetCategory.INSURANCE)
		);
	}
}
