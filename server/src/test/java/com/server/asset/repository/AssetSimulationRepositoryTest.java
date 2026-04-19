package com.server.asset.repository;

import static org.assertj.core.api.Assertions.*;

import com.server.BaseRepositoryTest;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.entity.enums.CareType;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@DisplayName("AssetSimulationRepository 테스트")
class AssetSimulationRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private AssetSimulationRepository repository;

    @Autowired
    private UserRepository userRepository;

    private TBUser user;

    @BeforeEach
    void setUp() {
        user = userRepository.findByLoginId("sim_user").orElseGet(() -> 
            userRepository.save(TBUser.builder()
                .loginId("sim_user")
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
    @DisplayName("자산 시뮬레이션 저장 테스트")
    void saveSimulationTest() {
        TBAssetSimulation simulation = TBAssetSimulation.builder()
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
            .build();

        TBAssetSimulation saved = repository.save(simulation);

        assertThat(saved.getSimulationId()).isNotNull();
        assertThat(saved.getCareType()).isEqualTo(CareType.HOME);
        assertThat(saved.getTargetAge()).isEqualTo(75);
    }

    @Test
    @DisplayName("userId로 시뮬레이션 존재 여부 확인 - 존재함")
    void existsByUserIdTrueTest() {
        repository.save(TBAssetSimulation.builder()
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

        assertThat(repository.existsByUser_UserId(user.getUserId())).isTrue();
    }

    @Test
    @DisplayName("userId로 최신 시뮬레이션 조회 테스트")
    void findFirstByUserIdOrderByCreatedAtDescTest() {
        repository.save(TBAssetSimulation.builder()
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

        Optional<TBAssetSimulation> result = repository.findFirstByUser_UserIdOrderByCreatedAtDesc(
            user.getUserId());
        assertThat(result).isPresent();
        assertThat(result.get().getUser().getUserId()).isEqualTo(user.getUserId());
    }

    @Test
    @DisplayName("userId, targetAge, careType으로 최신 시뮬레이션 조회 테스트")
    void findFirstByUserIdAndTargetAgeAndCareTypeTest() {
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

        Optional<TBAssetSimulation> result =
            repository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(
                user.getUserId(), 75, CareType.HOME);
        assertThat(result).isPresent();
        assertThat(result.get().getSimulationId()).isEqualTo(saved.getSimulationId());
    }

    @Test
    @DisplayName("존재하지 않는 조건으로 시뮬레이션 조회 - 빈값 반환")
    void findFirstByUserIdAndTargetAgeAndCareTypeNotFoundTest() {
        Optional<TBAssetSimulation> result =
            repository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(
                user.getUserId(), 99, CareType.PREMIUM);
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("존재하지 않는 userId로 시뮬레이션 존재 여부 - 없음")
    void existsByUserIdFalseTest() {
        assertThat(repository.existsByUser_UserId(999999L)).isFalse();
    }

    @Test
    @DisplayName("동일 조건 복수 시뮬레이션 저장 후 최신 조회 테스트")
    void findLatestAmongMultipleSimulationsTest() {
        repository.save(TBAssetSimulation.builder()
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
