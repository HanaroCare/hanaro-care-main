package com.server.asset.repository;

import static org.assertj.core.api.Assertions.*;

import com.server.BaseRepositoryTest;
import com.server.TestInitLoader;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.user.entity.TBUser;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class AccountRepositoryTest extends BaseRepositoryTest {

    private static long orgCount = 0;
    private static Long savedAccountId;
    private static TBUser user;

    @Autowired
    private TestInitLoader initLoader;

    @Autowired
    private AccountRepository repository;

    @BeforeEach
    void setUp() {
        if (orgCount == 0)
            orgCount = repository.count();
        if (user == null)
            user = initLoader.getTestUser();
    }

    @Test
    @DisplayName("현금 계좌 저장 테스트")
    @Order(1)
    void saveAccountTest() {
        TBAccount saved = repository.save(TBAccount.builder()
            .user(user)
            .instNm("하나은행")
            .accountNm("입출금통장")
            .accountNum("110-123-456789")
            .balanceAmt(new BigDecimal("1000000.00"))
            .assetCateCd(AssetCategory.CASH)
            .build());

        savedAccountId = saved.getAccountId();
        assertThat(saved.getAccountId()).isNotNull();
        assertThat(saved.getAccountNum()).isEqualTo("110-123-456789");
        assertThat(saved.getAssetCateCd()).isEqualTo(AssetCategory.CASH);
    }

    @Test
    @DisplayName("isLinked 기본값 true 확인 테스트")
    @Order(2)
    void isLinkedDefaultTrueTest() {
        TBAccount account = repository.findById(savedAccountId).orElseThrow();
        assertThat(account.getIsLinked()).isTrue();
    }

    @Test
    @DisplayName("userId와 카테고리로 계좌 조회 테스트")
    @Order(3)
    void findByUserIdAndAssetCateCdTest() {
        List<TBAccount> accounts = repository.findByUser_UserIdAndAssetCateCd(
            user.getUserId(), AssetCategory.CASH);
        assertThat(accounts).isNotEmpty();
        assertThat(accounts).allMatch(a -> a.getAssetCateCd() == AssetCategory.CASH);
    }

    @Test
    @DisplayName("userId로 전체 계좌 조회 테스트")
    @Order(4)
    void findAllByUserIdTest() {
        List<TBAccount> accounts = repository.findAllByUser_UserId(user.getUserId());
        assertThat(accounts).isNotEmpty();
        assertThat(repository.count()).isGreaterThanOrEqualTo(orgCount + 1);
    }

    @Test
    @DisplayName("userId로 총 잔액 합계 조회 테스트")
    @Order(5)
    void findTotalBalanceByUserIdTest() {
        BigDecimal total = repository.findTotalBalanceByUserId(user.getUserId());
        assertThat(total).isNotNull();
        assertThat(total).isGreaterThan(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("연결된 계좌의 총 잔액 합계 조회 테스트")
    @Order(6)
    void findTotalBalanceByUserIdAndIsLinkedTrueTest() {
        BigDecimal linkedTotal = repository.findTotalBalanceByUserIdAndIsLinkedTrue(user.getUserId());
        assertThat(linkedTotal).isNotNull();
        assertThat(linkedTotal).isGreaterThanOrEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("카테고리별 잔액 합계 그룹 조회 테스트")
    @Order(7)
    void findBalanceSumGroupByCategoryTest() {
        List<Object[]> results = repository.findBalanceSumGroupByCategoryByUserIdAndIsLinkedTrue(
            user.getUserId());
        assertThat(results).isNotEmpty();
        for (Object[] row : results) {
            assertThat(row[0]).isInstanceOf(AssetCategory.class);
            assertThat(row[1]).isInstanceOf(BigDecimal.class);
        }
    }

    @Test
    @DisplayName("복수 카테고리로 계좌 조회 테스트")
    @Order(8)
    void findByUserIdAndAssetCateCdInTest() {
        List<TBAccount> accounts = repository.findByUser_UserIdAndAssetCateCdIn(
            user.getUserId(), List.of(AssetCategory.CASH, AssetCategory.INSURANCE));
        assertThat(accounts).isNotEmpty();
    }

    @Test
    @DisplayName("accountId와 카테고리로 단건 계좌 조회 테스트")
    @Order(9)
    void findByAccountIdAndAssetCateCdTest() {
        Optional<TBAccount> found = repository.findByAccountIdAndAssetCateCd(
            savedAccountId, AssetCategory.CASH);
        assertThat(found).isPresent();
        assertThat(found.get().getAccountId()).isEqualTo(savedAccountId);
    }

    @Test
    @DisplayName("userId 연결 계좌 존재 여부 - 존재함")
    @Order(10)
    void existsByUserIdAndIsLinkedTrueTest() {
        assertThat(repository.existsByUser_UserIdAndIsLinkedTrue(user.getUserId())).isTrue();
    }

    @Test
    @DisplayName("CASH 제외 연결 계좌 조회 테스트")
    @Order(11)
    void findAllByUserIdAndAssetCateCdNotAndIsLinkedTrueTest() {
        repository.save(TBAccount.builder()
            .user(user)
            .instNm("미래에셋")
            .accountNm("주식계좌")
            .accountNum("456-789-001")
            .balanceAmt(new BigDecimal("500000.00"))
            .assetCateCd(AssetCategory.STOCK)
            .build());

        List<TBAccount> accounts = repository.findAllByUser_UserIdAndAssetCateCdNotAndIsLinkedTrue(
            user.getUserId(), AssetCategory.CASH);
        assertThat(accounts).isNotEmpty();
        assertThat(accounts).noneMatch(a -> a.getAssetCateCd() == AssetCategory.CASH);
    }

    @Test
    @DisplayName("특정 카테고리의 연결 계좌 조회 테스트")
    @Order(12)
    void findByUserIdAndAssetCateCdAndIsLinkedTrueTest() {
        List<TBAccount> accounts = repository.findByUser_UserIdAndAssetCateCdAndIsLinkedTrue(
            user.getUserId(), AssetCategory.CASH);
        assertThat(accounts).isNotEmpty();
        assertThat(accounts).allMatch(a -> a.getIsLinked() && a.getAssetCateCd() == AssetCategory.CASH);
    }
}