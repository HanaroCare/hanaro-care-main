package com.server.inheritance.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

@Rollback(true)
public class InheritPlanRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private InheritPlanRepository inheritPlanRepository;

    @Autowired
    private UserRepository userRepository;

    private TBUser user;

    @BeforeEach
    void setUp() {
        user = userRepository.findByLoginId("testuser01").orElseGet(() -> 
            userRepository.save(TBUser.builder()
                .loginId("testuser01")
                .userNm("테스트유저")
                .userAge(30)
                .userPhone("01012345678")
                .userPwd("password")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .isHanaCert(true)
                .build())
        );
    }

    @Test
    @DisplayName("사용자 ID로 상속 플랜 조회")
    void findByUserIdTest() {
        // given
        TBInheritPlan plan = TBInheritPlan.builder()
                .user(user)
                .totalInheritAmt(new BigDecimal("1000000000"))
                .estiTaxAmt(new BigDecimal("100000000"))
                .build();
        inheritPlanRepository.save(plan);

        // when
        Optional<TBInheritPlan> foundPlan = inheritPlanRepository.findByUserId(user.getUserId());

        // then
        assertThat(foundPlan).isPresent();
        assertThat(foundPlan.get().getUser().getUserId()).isEqualTo(user.getUserId());
        assertThat(foundPlan.get().getTotalInheritAmt()).isEqualByComparingTo("1000000000");
    }

    @Test
    @DisplayName("사용자 ID로 상속 플랜 조회 (UnderScore 메서드)")
    void findByUser_UserIdTest() {
        // given
        TBInheritPlan plan = TBInheritPlan.builder()
                .user(user)
                .totalInheritAmt(new BigDecimal("500000000"))
                .estiTaxAmt(new BigDecimal("0"))
                .build();
        inheritPlanRepository.save(plan);

        // when
        Optional<TBInheritPlan> foundPlan = inheritPlanRepository.findByUser_UserId(user.getUserId());

        // then
        assertThat(foundPlan).isPresent();
        assertThat(foundPlan.get().getUser().getUserId()).isEqualTo(user.getUserId());
    }
}
