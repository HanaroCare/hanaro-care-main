package com.server.user;

import static org.assertj.core.api.Assertions.assertThat;

import com.server.BaseRepositoryTest;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.enums.UserStatus;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * FamilyAuthRepository 테스트
 */
@DisplayName("FamilyAuthRepository 테스트")
class FamilyAuthRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private FamilyAuthRepository familyAuthRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String GRANTEE_LOGIN_ID = "grantee_user_01";
    
    private TBUser managedTestUser() {
        return userRepository.findByLoginId("testuser01")
                .orElseGet(() -> userRepository.save(TBUser.builder()
                        .loginId("testuser01")
                        .userNm("테스트유저")
                        .userAge(30)
                        .userPhone("01011112222")
                        .userPwd("pwd123!")
                        .userStatusCd(UserStatus.ACTIVE)
                        .build()));
    }

    private TBUser managedGranteeUser() {
        return userRepository.findByLoginId(GRANTEE_LOGIN_ID)
                .orElseThrow(() -> new IllegalStateException(
                        GRANTEE_LOGIN_ID + " 유저가 DB에 없습니다. setUp_granteeUser (Order 1)가 먼저 실행되어야 합니다."));
    }
    
    @Test
    @Order(1)
    @DisplayName("[셋업] granteeUser 저장 (saveAndFlush로 즉시 커밋 보장)")
    void setUp_granteeUser() {
        TBUser grantee = TBUser.builder()
                .loginId(GRANTEE_LOGIN_ID)
                .userNm("수혜자유저")
                .userAge(40)
                .userPhone("01088887777")
                .userAddr("서울시 마포구")
                .userPwd("pwd456!")
                .userStatusCd(UserStatus.ACTIVE)
                .build();

        TBUser saved = userRepository.saveAndFlush(grantee);
        assertThat(saved.getUserId()).isNotNull();
        assertThat(userRepository.existsByLoginId(GRANTEE_LOGIN_ID)).isTrue();
    }

    @Test
    @Order(2)
    @DisplayName("[셋업] FamilyAuth 저장 (grantor=testUser, grantee=granteeUser, 보험 권한 O)")
    void setUp_familyAuth_withInsAndProxyClaim() {
        TBUser grantor = managedTestUser();
        TBUser grantee = managedGranteeUser();

        TBFamilyAuth auth = TBFamilyAuth.builder()
                .grantor(grantor)
                .grantee(grantee)
                .relationCd(FamilyRelation.CHILD)
                .isInsView(true)
                .isProxyClaim(true)
                .isTrustView(true)
                .isCardView(true)
                .build();

        TBFamilyAuth saved = familyAuthRepository.saveAndFlush(auth);
        assertThat(saved.getFamilyAuthId()).isNotNull();
    }

    @Test
    @Order(3)
    @DisplayName("[셋업] FamilyAuth 저장 (grantor=granteeUser, grantee=testUser, 보험 권한 X)")
    void setUp_familyAuth_noInsView() {
        // 역방향: granteeUser → testUser
        TBUser grantor = managedGranteeUser();
        TBUser grantee = managedTestUser();

        TBFamilyAuth auth = TBFamilyAuth.builder()
                .grantor(grantor)
                .grantee(grantee)
                .relationCd(FamilyRelation.PARENT)
                .isInsView(false)
                .isProxyClaim(false)
                .isTrustView(false)
                .isCardView(false)
                .build();

        TBFamilyAuth saved = familyAuthRepository.saveAndFlush(auth);
        assertThat(saved.getFamilyAuthId()).isNotNull();
    }

    @Test
    @Order(4)
    @DisplayName("findByGrantor_UserIdAndGrantee_UserId: 존재하는 쌍 → 반환")
    void findByGrantorAndGrantee_success() {
        Long grantorId = managedTestUser().getUserId();
        Long granteeId = managedGranteeUser().getUserId();

        Optional<TBFamilyAuth> result =
                familyAuthRepository.findByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId);

        assertThat(result).isPresent();
        assertThat(result.get().getRelationCd()).isEqualTo(FamilyRelation.CHILD);
    }

    @Test
    @Order(5)
    @DisplayName("findByGrantor_UserIdAndGrantee_UserId: 존재하지 않는 쌍 → empty")
    void findByGrantorAndGrantee_notFound() {
        Optional<TBFamilyAuth> result =
                familyAuthRepository.findByGrantor_UserIdAndGrantee_UserId(
                        Long.MAX_VALUE, Long.MAX_VALUE);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(6)
    @DisplayName("findApprovedFamilyByGrantorId: grantor userId → 수혜자 목록 반환")
    void findApprovedFamilyByGrantorId_success() {
        Long grantorId = managedTestUser().getUserId();

        List<TBFamilyAuth> result = familyAuthRepository.findApprovedFamilyByGrantorId(grantorId);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(f -> f.getGrantor().getUserId().equals(grantorId));
    }

    @Test
    @Order(7)
    @DisplayName("findApprovedFamilyByGranteeId: grantee userId → 부여자 목록 반환")
    void findApprovedFamilyByGranteeId_success() {
        Long granteeId = managedGranteeUser().getUserId();

        List<TBFamilyAuth> result = familyAuthRepository.findApprovedFamilyByGranteeId(granteeId);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(f -> f.getGrantee().getUserId().equals(granteeId));
    }

    @Test
    @Order(8)
    @DisplayName("findAllByGrantee_UserIdAndIsTrustViewTrue: 신탁 권한 있는 항목 → 반환")
    void findAllByGrantee_TrustViewTrue() {
        Long granteeId = managedGranteeUser().getUserId();

        List<TBFamilyAuth> result =
                familyAuthRepository.findAllByGrantee_UserIdAndIsTrustViewTrue(granteeId);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(TBFamilyAuth::getIsTrustView);
    }

    @Test
    @Order(9)
    @DisplayName("findAllByGrantee_UserIdAndIsTrustViewTrue: isTrustView=false인 grantee → 빈 리스트")
    void findAllByGrantee_TrustViewTrue_noResult() {
        // testUser는 grantee이지만 Order 3에서 isTrustView=false로 저장됨
        Long testUserId = managedTestUser().getUserId();

        List<TBFamilyAuth> result =
                familyAuthRepository.findAllByGrantee_UserIdAndIsTrustViewTrue(testUserId);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(10)
    @DisplayName("findAllByGrantee_UserId: grantee userId → 권한 목록 반환")
    void findAllByGranteeUserId() {
        Long granteeId = managedGranteeUser().getUserId();

        List<TBFamilyAuth> result = familyAuthRepository.findAllByGrantee_UserId(granteeId);

        assertThat(result).isNotEmpty();
    }

    @Test
    @Order(11)
    @DisplayName("existsByGrantor_UserIdAndGrantee_UserId: 존재하는 쌍 → true")
    void existsByGrantorAndGrantee_true() {
        Long grantorId = managedTestUser().getUserId();
        Long granteeId = managedGranteeUser().getUserId();

        Boolean exists = familyAuthRepository
                .existsByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId);

        assertThat(exists).isTrue();
    }

    @Test
    @Order(12)
    @DisplayName("existsByGrantor_UserIdAndGrantee_UserId: 없는 쌍 → false")
    void existsByGrantorAndGrantee_false() {
        Boolean exists = familyAuthRepository
                .existsByGrantor_UserIdAndGrantee_UserId(Long.MAX_VALUE, Long.MAX_VALUE);

        assertThat(exists).isFalse();
    }

    @Test
    @Order(13)
    @DisplayName("findAllByGrantorUserId: grantor userId → 목록 반환")
    void findAllByGrantorUserId() {
        Long grantorId = managedTestUser().getUserId();

        List<TBFamilyAuth> result = familyAuthRepository.findAllByGrantorUserId(grantorId);

        assertThat(result).isNotEmpty();
    }

    @Test
    @Order(14)
    @DisplayName("findAllByGrantor_UserId: grantor userId → 목록 반환")
    void findAllByGrantor_UserId() {
        Long grantorId = managedTestUser().getUserId();

        List<TBFamilyAuth> result = familyAuthRepository.findAllByGrantor_UserId(grantorId);

        assertThat(result).isNotEmpty();
    }

    @Test
    @Order(15)
    @DisplayName("findAllByGrantee_UserIdAndIsInsView: isInsView=true → 보험 권한 항목 반환")
    void findAllByGranteeAndIsInsView_true() {
        Long granteeId = managedGranteeUser().getUserId();

        List<TBFamilyAuth> result =
                familyAuthRepository.findAllByGrantee_UserIdAndIsInsView(granteeId, true);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(TBFamilyAuth::getIsInsView);
    }

    @Test
    @Order(16)
    @DisplayName("findAllByGrantee_UserIdAndIsInsView: isInsView=false → 빈 리스트")
    void findAllByGranteeAndIsInsView_false() {
        Long granteeId = managedGranteeUser().getUserId();

        // granteeId가 grantee인 레코드 중 isInsView=false인 것은 없음 (Order 2에서 true로 저장)
        List<TBFamilyAuth> result =
                familyAuthRepository.findAllByGrantee_UserIdAndIsInsView(granteeId, false);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(17)
    @DisplayName("findByGrantor_UserIdAndGrantee_UserIdAndIsInsView: isInsView=true → 반환")
    void findByGrantorGranteeAndIsInsView_true() {
        Long grantorId = managedTestUser().getUserId();
        Long granteeId = managedGranteeUser().getUserId();

        Optional<TBFamilyAuth> result = familyAuthRepository
                .findByGrantor_UserIdAndGrantee_UserIdAndIsInsView(grantorId, granteeId, true);

        assertThat(result).isPresent();
    }

    @Test
    @Order(18)
    @DisplayName("findByGrantor_UserIdAndGrantee_UserIdAndIsInsView: isInsView=false → empty")
    void findByGrantorGranteeAndIsInsView_false() {
        Long grantorId = managedTestUser().getUserId();
        Long granteeId = managedGranteeUser().getUserId();

        Optional<TBFamilyAuth> result = familyAuthRepository
                .findByGrantor_UserIdAndGrantee_UserIdAndIsInsView(grantorId, granteeId, false);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(19)
    @DisplayName("existsByGrantee_UserIdAndIsProxyClaimTrue: isProxyClaim=true인 grantee → true")
    void existsByGranteeAndIsProxyClaimTrue_true() {
        Long granteeId = managedGranteeUser().getUserId();

        Boolean exists = familyAuthRepository
                .existsByGrantee_UserIdAndIsProxyClaimTrue(granteeId);

        assertThat(exists).isTrue();
    }

    @Test
    @Order(20)
    @DisplayName("existsByGrantee_UserIdAndIsProxyClaimTrue: isProxyClaim=false인 grantee → false")
    void existsByGranteeAndIsProxyClaimTrue_false() {
        // testUser는 grantee이지만 Order 3에서 isProxyClaim=false로 저장됨
        Long testUserId = managedTestUser().getUserId();

        Boolean exists = familyAuthRepository
                .existsByGrantee_UserIdAndIsProxyClaimTrue(testUserId);

        assertThat(exists).isFalse();
    }

    @Test
    @Order(21)
    @DisplayName("findAllByGrantor_UserIdAndIsCardViewTrue: 카드 열람 권한 부여자 → 반환")
    void findAllByGrantorAndIsCardViewTrue() {
        Long grantorId = managedTestUser().getUserId();

        List<TBFamilyAuth> result =
                familyAuthRepository.findAllByGrantor_UserIdAndIsCardViewTrue(grantorId);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(TBFamilyAuth::getIsCardView);
    }

    @Test
    @Order(22)
    @DisplayName("findAllByGrantee_UserIdAndIsCardViewTrue: 카드 열람 권한 수혜자 → 반환")
    void findAllByGranteeAndIsCardViewTrue() {
        Long granteeId = managedGranteeUser().getUserId();

        List<TBFamilyAuth> result =
                familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(granteeId);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(TBFamilyAuth::getIsCardView);
    }

    @Test
    @Order(23)
    @DisplayName("findAll: 저장된 FamilyAuth 전체 조회 → 2건 이상")
    void findAll_returnsAll() {
        List<TBFamilyAuth> result = familyAuthRepository.findAll();

        assertThat(result).hasSizeGreaterThanOrEqualTo(2);
    }
    
    @Test
    @Order(24)
    @DisplayName("[정리] FamilyAuth 삭제 후 granteeUser 삭제 (FK 순서 보장)")
    void tearDown_cleanup() {
        Long grantorId = managedTestUser().getUserId();
        Long granteeId = managedGranteeUser().getUserId();

        // FK 참조가 있는 FamilyAuth를 먼저 삭제해야 granteeUser 삭제 가능
        familyAuthRepository.findByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId)
                .ifPresent(f -> familyAuthRepository.deleteById(f.getFamilyAuthId()));

        familyAuthRepository.findByGrantor_UserIdAndGrantee_UserId(granteeId, grantorId)
                .ifPresent(f -> familyAuthRepository.deleteById(f.getFamilyAuthId()));

        userRepository.deleteById(granteeId);

        assertThat(userRepository.existsByLoginId(GRANTEE_LOGIN_ID)).isFalse();
    }
}
