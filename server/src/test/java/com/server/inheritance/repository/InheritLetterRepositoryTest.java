package com.server.inheritance.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.inheritance.enums.LetterType;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

@Rollback(true)
public class InheritLetterRepositoryTest extends BaseRepositoryTest {

  @Autowired
  private InheritLetterRepository inheritLetterRepository;

  @Autowired
  private InheritDetailRepository inheritDetailRepository;

  @Autowired
  private InheritPlanRepository inheritPlanRepository;

  @Autowired
  private UserRepository userRepository;

  private TBUser user;
  private TBInheritPlan plan;
  private TBInheritDetail detail;

  @BeforeEach
  void setUp() {

    user = TBUser.builder()
        .loginId("test_user")
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
        .build();
    plan = inheritPlanRepository.save(plan);

    detail = TBInheritDetail.builder()
        .inheritPlan(plan)
        .user(user)
        .distRatio(new BigDecimal("100.00"))
        .relationCd(FamilyRelation.SPOUSE)
        .build();
    detail = inheritDetailRepository.save(detail);
  }

  @Test
  @DisplayName("inheritDetailId로 InheritLetter 조회 성공")
  void findByInheritDetail_InheritDetailId_success() {

    // given
    TBInheritLetter letter = TBInheritLetter.builder()
        .inheritDetail(detail)
        .letterTypeCd(LetterType.WRITING)
        .letterCont("테스트 편지 내용")
        .voiceUrl(null)
        .build();

    inheritLetterRepository.save(letter);

    // when
    TBInheritLetter result =
        inheritLetterRepository.findByInheritDetail_InheritDetailId(
            detail.getInheritDetailId()
        ).orElse(null);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getLetterCont()).isEqualTo("테스트 편지 내용");
    assertThat(result.getInheritDetail().getInheritDetailId())
        .isEqualTo(detail.getInheritDetailId());
  }

  @Test
  @DisplayName("inheritDetailId로 InheritLetter 조회 실패")
  void findByInheritDetail_InheritDetailId_fail() {

    // when
    var result = inheritLetterRepository
        .findByInheritDetail_InheritDetailId(999L);

    // then
    assertThat(result).isEmpty();
  }
}
