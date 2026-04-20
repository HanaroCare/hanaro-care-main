package com.server.asset.repository;

import static org.assertj.core.api.Assertions.*;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@DisplayName("RealAssetRepository 테스트")
class RealAssetRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private RealAssetRepository repository;

    @Autowired
    private UserRepository userRepository;

    private TBUser user;

    @BeforeEach
    void setUp() {
        user = userRepository.findByLoginId("asset_user").orElseGet(() -> 
            userRepository.save(TBUser.builder()
                .loginId("asset_user")
                .userNm("테스트유저")
                .userAge(65)
                .userPhone("01012345678")
                .userPwd("pwd!")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .userRole(SubscriberRole.ROLE_USER)
                .isHanaCert(false)
                .build())
        );
    }

    @Test
    @DisplayName("부동산 실물자산 저장 테스트")
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

        assertThat(saved.getRealAssetId()).isNotNull();
        assertThat(saved.getAssetCateCd()).isEqualTo(RealAssetCategory.REAL_ESTATE);
        assertThat(saved.getAssetNm()).isEqualTo("서울 아파트");
    }

    @Test
    @DisplayName("realAssetId로 단건 조회 테스트")
    void findByRealAssetIdTest() {
        TBRealAsset saved = repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.REAL_ESTATE)
            .assetNm("서울 아파트")
            .evalAmt(new BigDecimal("500000000.00"))
            .build());

        Optional<TBRealAsset> found = repository.findByRealAssetId(saved.getRealAssetId());
        assertThat(found).isPresent();
        assertThat(found.get().getRealAssetId()).isEqualTo(saved.getRealAssetId());
    }

    @Test
    @DisplayName("realAssetId와 userId로 단건 조회 테스트")
    void findByRealAssetIdAndUserIdTest() {
        TBRealAsset saved = repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.REAL_ESTATE)
            .assetNm("서울 아파트")
            .evalAmt(new BigDecimal("500000000.00"))
            .build());

        Optional<TBRealAsset> found = repository.findByRealAssetIdAndUser_UserId(
            saved.getRealAssetId(), user.getUserId());
        assertThat(found).isPresent();
        assertThat(found.get().getUser().getUserId()).isEqualTo(user.getUserId());
    }

    @Test
    @DisplayName("존재하지 않는 userId로 실물자산 조회 - 빈값 반환")
    void findByRealAssetIdAndUserIdNotFoundTest() {
        TBRealAsset saved = repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.REAL_ESTATE)
            .assetNm("서울 아파트")
            .evalAmt(new BigDecimal("500000000.00"))
            .build());

        Optional<TBRealAsset> found = repository.findByRealAssetIdAndUser_UserId(
            saved.getRealAssetId(), 999999L);
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("userId로 전체 실물자산 조회 테스트")
    void findAllByUserIdTest() {
        repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.REAL_ESTATE)
            .assetNm("서울 아파트")
            .evalAmt(new BigDecimal("500000000.00"))
            .build());

        List<TBRealAsset> assets = repository.findAllByUser_UserId(user.getUserId());
        assertThat(assets).isNotEmpty();
    }

    @Test
    @DisplayName("userId와 카테고리로 실물자산 조회 테스트")
    void findAllByUserIdAndAssetCateCdTest() {
        repository.save(TBRealAsset.builder()
            .user(user)
            .assetCateCd(RealAssetCategory.REAL_ESTATE)
            .assetNm("서울 아파트")
            .evalAmt(new BigDecimal("500000000.00"))
            .build());

        List<TBRealAsset> realEstates = repository.findAllByUser_UserIdAndAssetCateCd(
            user.getUserId(), RealAssetCategory.REAL_ESTATE);
        assertThat(realEstates).isNotEmpty();
        assertThat(realEstates).allMatch(a -> a.getAssetCateCd() == RealAssetCategory.REAL_ESTATE);
    }

    @Test
    @DisplayName("자동차 실물자산 저장 후 카테고리별 조회 테스트")
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
    void findAllByUserIdAndGoldCategoryEmptyTest() {
        List<TBRealAsset> golds = repository.findAllByUser_UserIdAndAssetCateCd(
            user.getUserId(), RealAssetCategory.GOLD);
        assertThat(golds).isEmpty();
    }
}
