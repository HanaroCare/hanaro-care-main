package com.server.inheritance.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

@Rollback(true)
public class InheritDetailRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private InheritDetailRepository inheritDetailRepository;

    @Autowired
    private InheritPlanRepository inheritPlanRepository;

    @Autowired
    private UserRepository userRepository;

    private TBUser user;
    private TBInheritPlan plan;

    @BeforeEach
    void setUp() {
        user = TBUser.builder()
                .loginId("testuser_detail")
                .userNm("테스트유저")
                .userAge(30)
                .userPhone("01011112222")
                .userPwd("password")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .isHanaCert(true)
                .build();
        user = userRepository.save(user);

        plan = TBInheritPlan.builder()
                .user(user)
                .totalInheritAmt(new BigDecimal("1000000000"))
                .estiTaxAmt(new BigDecimal("100000000"))
                .build();
        plan = inheritPlanRepository.save(plan);
    }

    @Test
    @DisplayName("상속 플랜 ID로 상세 내역 조회")
    void findByInheritPlanIdTest() {
        // given
        TBInheritDetail detail = TBInheritDetail.builder()
                .inheritPlan(plan)
                .relationCd(FamilyRelation.SPOUSE)
                .distRatio(new BigDecimal("50.00"))
                .heirName("배우자")
                .build();
        inheritDetailRepository.save(detail);

        // when
        List<TBInheritDetail> details = inheritDetailRepository.findByInheritPlanId(plan.getId());

        // then
        assertThat(details).hasSize(1);
        assertThat(details.get(0).getHeirName()).isEqualTo("배우자");
    }

    @Test
    @DisplayName("사용자 ID로 상세 내역 존재 여부 확인")
    void existsByUser_UserIdTest() {
        // given
        TBUser heir = TBUser.builder()
                .loginId("heir_user")
                .userNm("상속인")
                .userAge(25)
                .userPhone("01033334444")
                .userPwd("password")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .build();
        heir = userRepository.save(heir);

        TBInheritDetail detail = TBInheritDetail.builder()
                .inheritPlan(plan)
                .user(heir)
                .relationCd(FamilyRelation.CHILD)
                .distRatio(new BigDecimal("50.00"))
                .heirName(heir.getUserNm())
                .build();
        inheritDetailRepository.save(detail);

        // when
        boolean exists = inheritDetailRepository.existsByUser_UserId(heir.getUserId());

        // then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("사용자 ID로 상세 내역 조회")
    void findByUser_UserIdTest() {
        // given
        TBUser heir = TBUser.builder()
                .loginId("heir_user_2")
                .userNm("상속인2")
                .userAge(26)
                .userPhone("01055556666")
                .userPwd("password")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .build();
        heir = userRepository.save(heir);

        TBInheritDetail detail = TBInheritDetail.builder()
                .inheritPlan(plan)
                .user(heir)
                .relationCd(FamilyRelation.CHILD)
                .distRatio(new BigDecimal("50.00"))
                .heirName(heir.getUserNm())
                .build();
        inheritDetailRepository.save(detail);

        // when
        Optional<TBInheritDetail> foundDetail = inheritDetailRepository.findByUser_UserId(heir.getUserId());

        // then
        assertThat(foundDetail).isPresent();
        assertThat(foundDetail.get().getHeirName()).isEqualTo("상속인2");
    }

    @Test
    @DisplayName("상속 플랜 ID로 모든 상세 내역 조회 (UnderScore 메서드)")
    void findAllByInheritPlan_IdTest() {
        // given
        TBInheritDetail detail = TBInheritDetail.builder()
                .inheritPlan(plan)
                .relationCd(FamilyRelation.SPOUSE)
                .distRatio(new BigDecimal("100.00"))
                .heirName("배우자")
                .build();
        inheritDetailRepository.save(detail);

        // when
        List<TBInheritDetail> details = inheritDetailRepository.findAllByInheritPlan_Id(plan.getId());

        // then
        assertThat(details).isNotEmpty();
        assertThat(details.get(0).getInheritPlan().getId()).isEqualTo(plan.getId());
    }
}
