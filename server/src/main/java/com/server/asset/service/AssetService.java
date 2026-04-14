package com.server.asset.service;

import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.dto.response.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.response.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.RealAssetRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

  private final AccountRepository accountRepository;
  private final RealAssetRepository realAssetRepository;

  public AssetDashboardResponse getAssetDashboard(Long userId) {
    BigDecimal totalFinancialAmt = accountRepository.findTotalBalanceByUserId(userId);
    if (totalFinancialAmt == null) {
      totalFinancialAmt = BigDecimal.ZERO;
    }

    List<FinancialAssetSummary> financialAssets = accountRepository
        .findBalanceSumGroupByCategoryByUserId(userId)
        .stream()
        .map(row -> FinancialAssetSummary.builder()
            .assetCateCd((AssetCategory) row[0])
            .totalBalance((BigDecimal) row[1])
            .build())
        .toList();

    List<RealAssetSummary> realAssets = realAssetRepository
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
