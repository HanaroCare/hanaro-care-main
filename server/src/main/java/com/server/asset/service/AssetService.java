package com.server.asset.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.dto.dashboard.AssetChartPointDTO;
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
		return assetMapper.toAssetDetailListFromAccount(
			accountRepository.findByUser_UserIdAndAssetCateCdAndIsLinkedTrue(userId, AssetCategory.INSURANCE)
		);
	}

  @CheckUser(key = "#userId")
  public List<AssetChartPointDTO> getAssetChart(Long userId) {
    BigDecimal currentTotal = accountRepository.findTotalBalanceByUserIdAndIsLinkedTrue(userId);
    double currentAmt = (currentTotal != null ? currentTotal.doubleValue() : 0.0) / 100_000_000.0;

    LocalDate now = LocalDate.now();
    Random random = new Random();
    List<AssetChartPointDTO> result = new ArrayList<>();

    // 과거 5개월: 현재값 기준 ±3% 랜덤
    for (int i = 5; i >= 1; i--) {
      LocalDate past = now.minusMonths(i);
      double factor = 0.97 + random.nextDouble() * 0.06; // 0.97 ~ 1.03
      double value = Math.round(currentAmt * factor * 10.0) / 10.0;
      result.add(new AssetChartPointDTO(past.getMonthValue() + "월", value));
    }
    // 현재 달: 실제 DB 값
    double currentRounded = Math.round(currentAmt * 10.0) / 10.0;
    result.add(new AssetChartPointDTO(now.getMonthValue() + "월", currentRounded));

    return result;
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
}
