package com.server.asset.repository;

import static org.assertj.core.api.Assertions.*;

import com.server.BaseRepositoryTest;
import com.server.TestInitLoader;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.user.entity.TBUser;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class RealAssetRepositoryTest extends BaseRepositoryTest {

    private static TBUser user;
    private static Long savedRealAssetId;

    @Autowired
    private TestInitLoader initLoader;

    @Autowired
    private RealAssetRepository repository;

    @BeforeEach
    void setUp() {
        if (user == null)
            user = initLoader.getTestUser();
    }

    @Test
    @DisplayName("부동산 실물자산 저장 테스트")
    @Order(1)
    void saveRealEstateTest() {
        TBRealAsset saved = repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.REAL_ESTATE)
            .assetNm("서울 아파트")
            .evalAmt(new BigDecimal("500000000.00"))
            .addr("서울시 강남구 테헤란로 123")
            .assetSize(new BigDecimal("84.50"))
            .assetDesc("2023년 취득한 아파트")
            .build());

        savedRealAssetId = saved.getRealAssetId();
        assertThat(saved.getRealAssetId()).isNotNull();
        assertThat(saved.getAssetCateCd()).isEqualTo(RealAssetCategory.REAL_ESTATE);
        assertThat(saved.getAssetNm()).isEqualTo("서울 아파트");
    }

    @Test
    @DisplayName("realAssetId로 단건 조회 테스트")
    @Order(2)
    void findByRealAssetIdTest() {
        Optional<TBRealAsset> found = repository.findByRealAssetId(savedRealAssetId);
        assertThat(found).isPresent();
        assertThat(found.get().getRealAssetId()).isEqualTo(savedRealAssetId);
    }

    @Test
    @DisplayName("realAssetId와 userId로 단건 조회 테스트")
    @Order(3)
    void findByRealAssetIdAndUserIdTest() {
        Optional<TBRealAsset> found = repository.findByRealAssetIdAndUser_UserId(
            savedRealAssetId, user.getUserId());
        assertThat(found).isPresent();
        assertThat(found.get().getUser().getUserId()).isEqualTo(user.getUserId());
    }

    @Test
    @DisplayName("존재하지 않는 userId로 실물자산 조회 - 빈값 반환")
    @Order(4)
    void findByRealAssetIdAndUserIdNotFoundTest() {
        Optional<TBRealAsset> found = repository.findByRealAssetIdAndUser_UserId(
            savedRealAssetId, 999999L);
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("userId로 전체 실물자산 조회 테스트")
    @Order(5)
    void findAllByUserIdTest() {
        List<TBRealAsset> assets = repository.findAllByUser_UserId(user.getUserId());
        assertThat(assets).isNotEmpty();
    }

    @Test
    @DisplayName("userId와 카테고리로 실물자산 조회 테스트")
    @Order(6)
    void findAllByUserIdAndAssetCateCdTest() {
        List<TBRealAsset> realEstates = repository.findAllByUser_UserIdAndAssetCateCd(
            user.getUserId(), RealAssetCategory.REAL_ESTATE);
        assertThat(realEstates).isNotEmpty();
        assertThat(realEstates).allMatch(a -> a.getAssetCateCd() == RealAssetCategory.REAL_ESTATE);
    }

    @Test
    @DisplayName("자동차 실물자산 저장 후 카테고리별 조회 테스트")
    @Order(7)
    void findAllByUserIdAndVehicleCategoryTest() {
        repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.VEHICLE)
            .assetNm("제네시스 G80")
            .evalAmt(new BigDecimal("60000000.00"))
            .assetDesc("2022년 취득 차량")
            .build());

        List<TBRealAsset> vehicles = repository.findAllByUser_UserIdAndAssetCateCd(
            user.getUserId(), RealAssetCategory.VEHICLE);
        assertThat(vehicles).isNotEmpty();
        assertThat(vehicles).allMatch(a -> a.getAssetCateCd() == RealAssetCategory.VEHICLE);
    }

    @Test
    @DisplayName("존재하지 않는 카테고리로 조회 - 빈 리스트 반환")
    @Order(8)
    void findAllByUserIdAndGoldCategoryEmptyTest() {
        List<TBRealAsset> golds = repository.findAllByUser_UserIdAndAssetCateCd(
            user.getUserId(), RealAssetCategory.GOLD);
        assertThat(golds).isEmpty();
    }
}
