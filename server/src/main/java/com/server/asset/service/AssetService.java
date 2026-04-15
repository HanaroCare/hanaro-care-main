package com.server.asset.service;

import com.server.asset.dto.dashboard.AssetDashboardResponse;
import com.server.asset.dto.dashboard.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.dashboard.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.dashboard.AssetDetailResponse;
import com.server.asset.dto.dashboard.FinancialAssetResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.mapper.AssetMapper;
import com.server.asset.repository.TBAccountRepository;
import com.server.asset.repository.TBRealAssetRepository;
import com.server.common.annotation.CheckUser;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

  private final TBAccountRepository tbAccountRepository;
  private final TBRealAssetRepository tbRealAssetRepository;
  private final AssetMapper assetMapper;

  @CheckUser(key = "#userId")
  public AssetDashboardResponse getAssetDashboard(Long userId) {
    BigDecimal totalFinancialAmt = tbAccountRepository.findTotalBalanceByUserIdAndIsLinkedTrue(
        userId);
    totalFinancialAmt = (totalFinancialAmt != null) ? totalFinancialAmt : BigDecimal.ZERO;

    List<FinancialAssetSummary> financialAssets = assetMapper.toFinancialAssetSummaryList(
        tbAccountRepository.findBalanceSumGroupByCategoryByUserIdAndIsLinkedTrue(userId)
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

  @Transactional
  @CheckUser(key = "#userId")
  public void updateAssetLinkStatus(Long userId, List<Long> accountIds) {
    List<TBAccount> userAccounts = tbAccountRepository.findAllByUser_UserId(
        userId);

    userAccounts.forEach(account -> {
      boolean isLinked = accountIds.contains(account.getAccountId());
      account.setIsLinked(isLinked);
    });
  }

  @CheckUser(key = "#userId")
  public List<FinancialAssetResponse> getFinancialAssets(Long userId) {
    return assetMapper.toFinancialAssetResponseList(
        tbAccountRepository.findAllByUser_UserIdAndAssetCateCdNotAndIsLinkedTrue(userId,
            AssetCategory.INSURANCE)
    );
  }

  @CheckUser(key = "#userId")
  public List<AssetDetailResponse> getRealEstateAssets(Long userId) {
    return assetMapper.toAssetDetailListFromReal(
        tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId,
            RealAssetCategory.REAL_ESTATE)
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
        tbAccountRepository.findByUser_UserIdAndAssetCateCdAndIsLinkedTrue(userId,
            AssetCategory.INSURANCE)
    );
  }

  @CheckUser(key = "#userId")
  public List<AssetDetailResponse> getGoldAssets(Long userId) {
    return assetMapper.toAssetDetailListFromReal(
        tbRealAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.GOLD)
    );
  }
}
