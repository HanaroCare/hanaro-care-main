package com.server.asset.repository;

import static org.assertj.core.api.Assertions.*;

import com.server.BaseRepositoryTest;
import com.server.TestInitLoader;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.entity.enums.CareType;
import com.server.user.entity.TBUser;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class AssetSimulationRepositoryTest extends BaseRepositoryTest {

    private static TBUser user;
    private static Long savedSimulationId;

    @Autowired
    private TestInitLoader initLoader;

    @Autowired
    private AssetSimulationRepository repository;

    @BeforeEach
    void setUp() {
        if (user == null)
            user = initLoader.getTestUser();
    }

    @Test
    @DisplayName("자산 시뮬레이션 저장 테스트")
    @Order(1)
    void saveSimulationTest() {
        TBAssetSimulation saved = repository.save(TBAssetSimulation.builder()
            .user(user)
            .targetAge(75)
            .careType(CareType.HOME)
            .totalIncomeAmt(new BigDecimal("50000000.00"))
            .shortageAmt(new BigDecimal("5000000.00"))
            .isSufficient(false)
            .livingCost(new BigDecimal("1500000.00"))
            .medicalCost(new BigDecimal("500000.00"))
            .careCost(new BigDecimal("800000.00"))
            .monthlyCost(new BigDecimal("2800000.00"))
            .ageRangeDetails("{\"65-70\":{\"monthlyCost\":2000000}}")
            .build());

        savedSimulationId = saved.getSimulationId();
        assertThat(saved.getSimulationId()).isNotNull();
        assertThat(saved.getCareType()).isEqualTo(CareType.HOME);
        assertThat(saved.getTargetAge()).isEqualTo(75);
    }

    @Test
    @DisplayName("userId로 시뮬레이션 존재 여부 확인 - 존재함")
    @Order(2)
    void existsByUserIdTrueTest() {
        assertThat(repository.existsByUser_UserId(user.getUserId())).isTrue();
    }

    @Test
    @DisplayName("userId로 최신 시뮬레이션 조회 테스트")
    @Order(3)
    void findFirstByUserIdOrderByCreatedAtDescTest() {
        Optional<TBAssetSimulation> result = repository.findFirstByUser_UserIdOrderByCreatedAtDesc(
            user.getUserId());
        assertThat(result).isPresent();
        assertThat(result.get().getUser().getUserId()).isEqualTo(user.getUserId());
    }

    @Test
    @DisplayName("userId, targetAge, careType으로 최신 시뮬레이션 조회 테스트")
    @Order(4)
    void findFirstByUserIdAndTargetAgeAndCareTypeTest() {
        Optional<TBAssetSimulation> result =
            repository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(
                user.getUserId(), 75, CareType.HOME);
        assertThat(result).isPresent();
        assertThat(result.get().getSimulationId()).isEqualTo(savedSimulationId);
    }

    @Test
    @DisplayName("존재하지 않는 조건으로 시뮬레이션 조회 - 빈값 반환")
    @Order(5)
    void findFirstByUserIdAndTargetAgeAndCareTypeNotFoundTest() {
        Optional<TBAssetSimulation> result =
            repository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(
                user.getUserId(), 99, CareType.PREMIUM);
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("존재하지 않는 userId로 시뮬레이션 존재 여부 - 없음")
    @Order(6)
    void existsByUserIdFalseTest() {
        assertThat(repository.existsByUser_UserId(999999L)).isFalse();
    }

    @Test
    @DisplayName("동일 조건 복수 시뮬레이션 저장 후 최신 조회 테스트")
    @Order(7)
    void findLatestAmongMultipleSimulationsTest() {
        repository.save(TBAssetSimulation.builder()
            .user(user)
            .targetAge(75)
            .careType(CareType.HOME)
            .totalIncomeAmt(new BigDecimal("60000000.00"))
            .shortageAmt(BigDecimal.ZERO)
            .isSufficient(true)
            .livingCost(new BigDecimal("1500000.00"))
            .medicalCost(new BigDecimal("500000.00"))
            .careCost(new BigDecimal("800000.00"))
            .monthlyCost(new BigDecimal("2800000.00"))
            .ageRangeDetails("{\"65-70\":{\"monthlyCost\":2000000}}")
            .build());

        Optional<TBAssetSimulation> latest = repository.findFirstByUser_UserIdOrderByCreatedAtDesc(
            user.getUserId());
        assertThat(latest).isPresent();
        assertThat(latest.get().getIsSufficient()).isTrue();
    }
}
