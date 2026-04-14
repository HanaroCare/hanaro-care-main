package com.server.asset.service;

import com.server.asset.dto.AssetSummaryDTO;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.repository.TBAccountRepository;
import com.server.asset.repository.TBRealAssetRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

    private final TBAccountRepository accountRepository;
    private final TBRealAssetRepository realAssetRepository;

    public AssetSummaryDTO getAssetSummaryByUserId(Long userId) {
        List<TBAccount> accounts = accountRepository.findByUserId(userId);
        List<TBRealAsset> realAssets = realAssetRepository.findByUserId(userId);

        BigDecimal savings = BigDecimal.ZERO;
        BigDecimal stocks = BigDecimal.ZERO;
        BigDecimal pensions = BigDecimal.ZERO;
        BigDecimal realEstate = BigDecimal.ZERO;
        BigDecimal others = BigDecimal.ZERO;

        for (TBAccount acc : accounts) {
            switch (acc.getAssetCateCd()) {
                case CASH -> savings = savings.add(acc.getBalanceAmt());
                case STOCK -> stocks = stocks.add(acc.getBalanceAmt());
                case PENSION -> pensions = pensions.add(acc.getBalanceAmt());
                default -> others = others.add(acc.getBalanceAmt());
            }
        }

        for (TBRealAsset ra : realAssets) {
            if (ra.getAssetCateCd() == RealAssetCategory.REAL_ESTATE) {
                realEstate = realEstate.add(ra.getEvalAmt());
            } else {
                others = others.add(ra.getEvalAmt());
            }
        }

        BigDecimal total = savings.add(stocks).add(pensions).add(realEstate).add(others);

        return AssetSummaryDTO.builder()
                .savingsAndDeposits(savings)
                .stocksAndFunds(stocks)
                .pensions(pensions)
                .realEstate(realEstate)
                .otherAssets(others)
                .totalAsset(total)
                .build();
    }

    public BigDecimal getTotalAssetByUserId(Long userId) {
        return getAssetSummaryByUserId(userId).getTotalAsset();
    }

    public BigDecimal getExcludedInheritAmtByUserId(Long userId) {
        List<TBAccount> accounts = accountRepository.findByUserId(userId);
        List<TBRealAsset> realAssets = realAssetRepository.findByUserId(userId);

        BigDecimal excluded = BigDecimal.ZERO;
        for (TBAccount acc : accounts) {
            if (acc.getAssetCateCd() == AssetCategory.CARD) {
                excluded = excluded.add(acc.getBalanceAmt());
            }
        }
        for (TBRealAsset ra : realAssets) {
            if (ra.getAssetCateCd() == RealAssetCategory.VEHICLE) {
                excluded = excluded.add(ra.getEvalAmt());
            }
        }
        return excluded;
    }
}
