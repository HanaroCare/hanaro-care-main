package com.server.asset.util;

import static com.server.common.response.code.status.ErrorStatus.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.simulation.SimulationRequest;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBAssetTrans;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.entity.enums.TransType;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.AssetTransRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.common.exception.ApiException;
import com.server.user.entity.TBUser;
import com.server.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserContextUtil {

  private final UserRepository tbUserRepository;
  private final AssetTransRepository assetTransRepository;
  private final AccountRepository accountRepository;
  private final UserProdRepository userProdRepository;

  public AIAnalysisInput collectUserContext(Long userId, SimulationRequest request) {
    TBUser user = tbUserRepository.findById(userId)
        .orElseThrow(() -> new ApiException(USER_NOT_FOUND));

    LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
    List<TBAssetTrans> paymentHistory = assetTransRepository.findAllByUser_UserIdAndTransTypeAndTransDtAfter(
        userId, TransType.PAYMENT, oneYearAgo);

    Map<String, BigDecimal> spendingByCategory = aggregateSpending(paymentHistory);

    BigDecimal totalSpending = spendingByCategory.values().stream()
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal averageMonthlySpending = totalSpending.divide(new BigDecimal("12"), 2,
        RoundingMode.HALF_UP);

    BigDecimal totalAssetAmt = accountRepository.findTotalBalanceByUserId(userId);
    totalAssetAmt = (totalAssetAmt != null) ? totalAssetAmt : BigDecimal.ZERO;

    BigDecimal retirementPensionBalance = sumLinkedBalance(userId, AssetCategory.PENSION_RETIRE);
    BigDecimal personalPensionBalance = sumLinkedBalance(userId, AssetCategory.PENSION_PERSONAL);

    BigDecimal housingPensionMonthlyPayout = userProdRepository
        .findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(
            userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS)
        .map(prod -> prod.getMonthlyPayout() != null ? prod.getMonthlyPayout() : BigDecimal.ZERO)
        .orElse(BigDecimal.ZERO);

    return AIAnalysisInput.builder()
        .userId(userId)
        .userAge(user.getUserAge())
        .userAddr(simplifyAddress(user.getUserAddr()))
        .targetAge(request.getTargetAge())
        .careType(request.getCareType())
        .averageMonthlySpending(averageMonthlySpending)
        .spendingByCategory(spendingByCategory)
        .totalAssetAmt(totalAssetAmt)
        .retirementPensionBalance(retirementPensionBalance)
        .personalPensionBalance(personalPensionBalance)
        .housingPensionMonthlyPayout(housingPensionMonthlyPayout)
        .build();
  }

  private BigDecimal sumLinkedBalance(Long userId, AssetCategory category) {
    return accountRepository.findByUser_UserIdAndAssetCateCdAndIsLinkedTrue(userId, category)
        .stream()
        .map(TBAccount::getBalanceAmt)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  private Map<String, BigDecimal> aggregateSpending(List<TBAssetTrans> transactions) {
    Map<String, BigDecimal> categories = new HashMap<>();
    BigDecimal total = transactions.stream()
        .map(TBAssetTrans::getTransAmt)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (total.compareTo(BigDecimal.ZERO) == 0) {
      categories.put("LIVING", new BigDecimal("1000000"));
      categories.put("FOOD", new BigDecimal("500000"));
      categories.put("MEDICAL", new BigDecimal("200000"));
    } else {
      categories.put("TOTAL_SPENDING", total);
    }
    return categories;
  }

  private String simplifyAddress(String fullAddr) {
    if (fullAddr == null || fullAddr.isEmpty()) {
      return "서울시 강남구";
    }
    String[] parts = fullAddr.split(" ");
    return (parts.length >= 2) ? parts[0] + " " + parts[1] : fullAddr;
  }
}
