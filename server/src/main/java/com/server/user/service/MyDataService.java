package com.server.user.service;

import static com.server.user.service.MyDataProductPool.POOL_CARD;
import static com.server.user.service.MyDataProductPool.POOL_CASH;
import static com.server.user.service.MyDataProductPool.POOL_INSURANCE;
import static com.server.user.service.MyDataProductPool.POOL_PENSION;
import static com.server.user.service.MyDataProductPool.POOL_STOCK;
import static com.server.user.service.MyDataProductPool.ProductTemplate;

import com.server.asset.dto.link.AccountLinkResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.mapper.AssetMapper;
import com.server.asset.repository.AccountRepository;
import com.server.asset.service.SimulationRefreshService;
import com.server.asset.service.SimulationService;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBUserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyDataService {

  private static final Random RANDOM = new Random();
  private static final int[] CARD_PAY_DAYS = {1, 5, 14, 25};

  private final TBUserRepository userRepository;
  private final AccountRepository accountRepository;
  private final AssetMapper assetMapper;
  private final SimulationRefreshService simulationRefreshService;
  private final SimulationService simulationService;

  @Transactional
  @CheckUser(key = "#userId")
  public List<AccountLinkResponse> getConnectableAssets(Long userId, boolean hanaCertYn) {
    log.info("[MyData] 계좌 조회 요청 userId={} hanaCert={}", userId, hanaCertYn);
    List<TBAccount> accounts = accountRepository.findAllByUser_UserId(userId);

    if (accounts.isEmpty()) {
      log.info("[MyData] userId={} 계좌 없음 → 더미 데이터 생성 시작", userId);
      TBUser user = userRepository.findById(userId)
          .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));
      accounts = generateAndSaveAccounts(user);
    }

    return assetMapper.toAccountLinkResponseList(accounts);
  }

  @Transactional
  @CheckUser(key = "#userId")
  public void updateAssetLinkStatus(Long userId, List<String> selectedAccountIds,
      boolean hanaCertYn) {
    log.info("[MyData] 연동 상태 업데이트 userId={} hanaCert={} selected={}",
        userId, hanaCertYn, selectedAccountIds.size());
    List<TBAccount> userAccounts = accountRepository.findAllByUser_UserId(userId);

    userAccounts.forEach(account -> {
      String accountIdStr = String.valueOf(account.getAccountId());
      boolean linked = selectedAccountIds.contains(accountIdStr);
      account.setIsLinked(linked);
    });
    
    try {
      simulationService.createDefaultSimulationForUser(userId);
      simulationRefreshService.enqueue(userId);
    } catch (Exception e) {
      log.error("[MyData] 시뮬레이션 갱신 중 오류 발생: {}", e.getMessage());
    }
  }

  private List<TBAccount> generateAndSaveAccounts(TBUser user) {
    List<TBAccount> accounts = buildRandomAccounts(user);
    List<TBAccount> saved = accountRepository.saveAll(accounts);
    saved.forEach(a -> a.setIsLinked(true));
    return saved;
  }

  private List<TBAccount> buildRandomAccounts(TBUser user) {
    int age = resolveAge(user); // 연령 확인

    final long minAmt;
    final long maxAmt;

    if (age < 40) {
      minAmt = 100_000_000L;
      maxAmt = 500_000_000L;
    } else if (age < 50) {
      minAmt = 600_000_000L;
      maxAmt = 1_500_000_000L;
    } else {
      minAmt = 800_000_000L;
      maxAmt = 2_000_000_000L;
    }

    List<ProductTemplate> selected = new ArrayList<>();

    if (age < 30) {
      selected.add(pickOne(POOL_CASH));
      selected.add(pickOne(POOL_CARD));
      selected.add(pickOne(POOL_STOCK));
      if (RANDOM.nextBoolean()) {
        selected.add(pickOne(RANDOM.nextBoolean() ? POOL_INSURANCE : POOL_PENSION));
      }
    } else if (age < 50) {
      selected.add(pickOne(POOL_CASH));
      selected.add(pickOne(POOL_CARD));
      selected.add(pickOne(POOL_STOCK));
      if (RANDOM.nextBoolean()) {
        selected.add(pickOne(POOL_INSURANCE));
      }
      if (RANDOM.nextBoolean()) {
        selected.add(pickOne(POOL_PENSION));
      }
    } else {
      selected.add(pickOne(POOL_CASH));
      selected.add(pickOne(POOL_INSURANCE));
      selected.add(pickOne(POOL_PENSION));
      List<ProductTemplate> extras = new ArrayList<>(
          List.of(pickOne(POOL_CARD), pickOne(POOL_STOCK)));
      Collections.shuffle(extras);
      selected.addAll(extras.subList(0, 1 + RANDOM.nextInt(2)));
    }

    return selected.stream()
        .map(t -> build(user, t, minAmt, maxAmt))
        .toList();
  }

  private TBAccount build(TBUser user, ProductTemplate t, long min, long max) {
    long balance = min + (long) (RANDOM.nextDouble() * (max - min));
    String accNum = String.format("%03d-%03d-%06d", RANDOM.nextInt(900) + 100,
        RANDOM.nextInt(900) + 100, RANDOM.nextInt(1000000));

    TBAccount account = TBAccount.builder()
        .user(user).instNm(t.instNm()).accountNm(t.accountNm())
        .accountNum(accNum).balanceAmt(BigDecimal.valueOf(balance))
        .assetCateCd(t.category()).isLinked(true)
        .build();

    applyDetailFields(account, t.category(), account.getBalanceAmt());
    return account;
  }

  private void applyDetailFields(TBAccount account, AssetCategory category, BigDecimal balance) {
    LocalDate today = LocalDate.now();
    account.setProfitRate(BigDecimal.ZERO);
    account.setLimitAmt(BigDecimal.ZERO);
    account.setPayAmt(BigDecimal.ZERO);
    account.setMonthlyPremAmt(BigDecimal.ZERO);

    switch (category) {
      case CASH, PENSION -> {
        account.setContrDt(today.minusYears(1 + RANDOM.nextInt(3)));
        account.setExpireDt(today.plusYears(1 + RANDOM.nextInt(2)));
      }
      case CARD -> {
        account.setLimitAmt(BigDecimal.valueOf(5000000 + RANDOM.nextInt(15000000)));
        account.setPayDay(CARD_PAY_DAYS[RANDOM.nextInt(CARD_PAY_DAYS.length)]);
        account.setPayAmt(balance.multiply(BigDecimal.valueOf(0.1 + RANDOM.nextDouble() * 0.2))
            .setScale(0, RoundingMode.HALF_UP));
        account.setContrDt(today.minusMonths(RANDOM.nextInt(12)));
        account.setExpireDt(today.plusYears(3 + RANDOM.nextInt(2)));
      }
      case STOCK -> {
        account.setProfitRate(BigDecimal.valueOf(-15.0 + RANDOM.nextDouble() * 45.0)
            .setScale(2, RoundingMode.HALF_UP));
        account.setContrDt(today.minusYears(1 + RANDOM.nextInt(2)));
        account.setExpireDt(today.plusYears(1 + RANDOM.nextInt(3)));
      }
      case INSURANCE -> {
        account.setMonthlyPremAmt(BigDecimal.valueOf(50000 + RANDOM.nextInt(250000)));
        account.setContrDt(today.minusYears(3 + RANDOM.nextInt(3)));
        account.setExpireDt(today.plusYears(5 + RANDOM.nextInt(5)));
      }
    }
  }

  private int resolveAge(TBUser user) {
    Integer age = user.getUserAge();
    if (age == null || age <= 0) {
      log.warn("[MyData] userId={} 나이 정보 없음(간편로그인 추정) → 기본값 30세 적용",
          user.getUserId());
      return 58;
    }
    return age;
  }

  private ProductTemplate pickOne(List<ProductTemplate> pool) {
    return pool.get(RANDOM.nextInt(pool.size()));
  }
}