package com.server.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.server.BaseRepositoryTest;
import com.server.TestInitLoader;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserRepository 테스트
 */
@DisplayName("UserRepository 테스트")
class UserRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestInitLoader testInitLoader;

    private TBUser loadTestUser() {
        return userRepository.findByLoginId("testuser01")
                .orElseThrow(() -> new IllegalStateException(
                        "testuser01이 DB에 없습니다. TestInitLoader가 정상 실행되었는지 확인하세요."));
    }

    @Test
    @Order(1)
    @DisplayName("findByLoginId: 존재하는 loginId → 유저 반환 및 필드 검증")
    void findByLoginId_success() {
        Optional<TBUser> result = userRepository.findByLoginId("testuser01");

        assertThat(result).isPresent();
        assertThat(result.get().getUserNm()).isEqualTo("테스트유저");
        assertThat(result.get().getUserPhone()).isEqualTo("01012345678");
        assertThat(result.get().getUserStatusCd()).isEqualTo(UserStatus.ACTIVE);
        assertThat(result.get().getAuthMeansCd()).isEqualTo(LoginMeans.PASSWORD);
        assertThat(result.get().getUserId()).isNotNull();
    }

    @Test
    @Order(2)
    @DisplayName("findByLoginId: 존재하지 않는 loginId → empty Optional")
    void findByLoginId_notFound() {
        Optional<TBUser> result = userRepository.findByLoginId("ghost_user_xyz");

        assertThat(result).isEmpty();
    }

    @Test
    @Order(3)
    @DisplayName("existsByLoginId: 존재하는 loginId → true")
    void existsByLoginId_true() {
        assertThat(userRepository.existsByLoginId("testuser01")).isTrue();
    }

    @Test
    @Order(4)
    @DisplayName("existsByLoginId: 존재하지 않는 loginId → false")
    void existsByLoginId_false() {
        assertThat(userRepository.existsByLoginId("no_such_user_abc")).isFalse();
    }

    @Test
    @Order(5)
    @DisplayName("findByLoginIdAndUserPhone: loginId·전화번호 모두 일치 → 유저 반환")
    void findByLoginIdAndUserPhone_success() {
        Optional<TBUser> result =
                userRepository.findByLoginIdAndUserPhone("testuser01", "01012345678");

        assertThat(result).isPresent();
        assertThat(result.get().getLoginId()).isEqualTo("testuser01");
    }

    @Test
    @Order(6)
    @DisplayName("findByLoginIdAndUserPhone: 전화번호 불일치 → empty")
    void findByLoginIdAndUserPhone_wrongPhone() {
        Optional<TBUser> result =
                userRepository.findByLoginIdAndUserPhone("testuser01", "01099999999");

        assertThat(result).isEmpty();
    }

    @Test
    @Order(7)
    @DisplayName("findByLoginIdAndUserPhone: loginId 불일치 → empty")
    void findByLoginIdAndUserPhone_wrongLoginId() {
        Optional<TBUser> result =
                userRepository.findByLoginIdAndUserPhone("wrong_id", "01012345678");

        assertThat(result).isEmpty();
    }

    @Test
    @Order(8)
    @DisplayName("findByUserNmAndUserPhone: 이름·전화번호 일치 → 유저 반환")
    void findByUserNmAndUserPhone_success() {
        Optional<TBUser> result =
                userRepository.findByUserNmAndUserPhone("테스트유저", "01012345678");

        assertThat(result).isPresent();
        assertThat(result.get().getLoginId()).isEqualTo("testuser01");
    }

    @Test
    @Order(9)
    @DisplayName("findByUserNmAndUserPhone: 이름 불일치 → empty")
    void findByUserNmAndUserPhone_wrongName() {
        Optional<TBUser> result =
                userRepository.findByUserNmAndUserPhone("없는사람", "01012345678");

        assertThat(result).isEmpty();
    }

    @Test
    @Order(10)
    @DisplayName("findAllByUserStatusCdNot: DELETED 제외 → ACTIVE 유저 포함, DELETED 미포함")
    void findAllByUserStatusCdNot_excludeDeleted() {
        List<TBUser> result = userRepository.findAllByUserStatusCdNot(UserStatus.DELETED);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(u -> u.getUserStatusCd() != UserStatus.DELETED);
        assertThat(result).anyMatch(u -> u.getLoginId().equals("testuser01"));
    }

    @Test
    @Order(11)
    @DisplayName("findAllByUserStatusCdNot: ACTIVE 제외 → testUser 미포함")
    void findAllByUserStatusCdNot_excludeActive() {
        List<TBUser> result = userRepository.findAllByUserStatusCdNot(UserStatus.ACTIVE);

        assertThat(result).noneMatch(u -> u.getLoginId().equals("testuser01"));
    }

    @Test
    @Order(12)
    @DisplayName("findFirstByLoginIdStartingWithAndAuthMeansCd: 접두사·수단 일치 → 유저 반환")
    void findFirstByLoginIdStartingWithAndAuthMeansCd_success() {
        Optional<TBUser> result = userRepository
                .findFirstByLoginIdStartingWithAndAuthMeansCd("testuser", LoginMeans.PASSWORD);

        assertThat(result).isPresent();
        assertThat(result.get().getLoginId()).startsWith("testuser");
    }

    @Test
    @Order(13)
    @DisplayName("findFirstByLoginIdStartingWithAndAuthMeansCd: 접두사 불일치 → empty")
    void findFirstByLoginIdStartingWithAndAuthMeansCd_prefixMismatch() {
        Optional<TBUser> result = userRepository
                .findFirstByLoginIdStartingWithAndAuthMeansCd("ZZZNO_PREFIX", LoginMeans.PASSWORD);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(14)
    @DisplayName("findFirstByLoginIdStartingWithAndAuthMeansCd: 인증수단 불일치 → empty")
    void findFirstByLoginIdStartingWithAndAuthMeansCd_authMeansMismatch() {
        Optional<TBUser> result = userRepository
                .findFirstByLoginIdStartingWithAndAuthMeansCd("testuser", LoginMeans.FACEID);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(15)
    @DisplayName("findByIdWithLock: 존재하는 userId → 비관적 락으로 유저 반환")
    void findByIdWithLock_success() {
        Long userId = loadTestUser().getUserId();

        Optional<TBUser> result = userRepository.findByIdWithLock(userId);

        assertThat(result).isPresent();
        assertThat(result.get().getLoginId()).isEqualTo("testuser01");
        assertThat(result.get().getUserNm()).isEqualTo("테스트유저");
    }

    @Test
    @Order(16)
    @DisplayName("findByIdWithLock: 존재하지 않는 userId → empty")
    void findByIdWithLock_notFound() {
        Optional<TBUser> result = userRepository.findByIdWithLock(Long.MAX_VALUE);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(17)
    @DisplayName("findUserPhoneByUserId: userId → 전화번호 반환")
    void findUserPhoneByUserId() {
        Long userId = loadTestUser().getUserId();

        String phone = userRepository.findUserPhoneByUserId(userId);

        assertThat(phone).isEqualTo("01012345678");
    }

    @Test
    @Order(18)
    @DisplayName("findUserNmById: userId → 이름 반환")
    void findUserNmById() {
        Long userId = loadTestUser().getUserId();

        String name = userRepository.findUserNmById(userId);

        assertThat(name).isEqualTo("테스트유저");
    }

    @Test
    @Order(19)
    @DisplayName("searchAdminUsers: 이름 키워드 → 결과 포함")
    void searchAdminUsers_byName() {
        List<TBUser> result = userRepository.searchAdminUsers("테스트");

        assertThat(result).isNotEmpty();
        assertThat(result).anyMatch(u -> u.getUserNm().contains("테스트"));
    }

    @Test
    @Order(20)
    @DisplayName("searchAdminUsers: loginId 키워드 → 결과 포함")
    void searchAdminUsers_byLoginId() {
        List<TBUser> result = userRepository.searchAdminUsers("testuser");

        assertThat(result).isNotEmpty();
        assertThat(result).anyMatch(u -> u.getLoginId().contains("testuser"));
    }

    @Test
    @Order(21)
    @DisplayName("searchAdminUsers: 전화번호 키워드 → 결과 포함")
    void searchAdminUsers_byPhone() {
        List<TBUser> result = userRepository.searchAdminUsers("01012345678");

        assertThat(result).isNotEmpty();
    }

    @Test
    @Order(22)
    @DisplayName("searchAdminUsers: 대소문자 무시 검색 → 결과 포함 (lower() 함수 동작 확인)")
    void searchAdminUsers_caseInsensitive() {
        List<TBUser> result = userRepository.searchAdminUsers("TESTUSER");

        assertThat(result).isNotEmpty();
    }

    @Test
    @Order(23)
    @DisplayName("searchAdminUsers: 매칭 없는 키워드 → 빈 리스트")
    void searchAdminUsers_noMatch() {
        List<TBUser> result = userRepository.searchAdminUsers("ZZZNO_MATCH_XYZ");

        assertThat(result).isEmpty();
    }

    @Test
    @Order(24)
    @DisplayName("save: 신규 유저 저장 → TSID 자동 생성 확인")
    void save_newUser() {
        TBUser newUser = TBUser.builder()
                .loginId("savetest01")
                .userNm("저장테스트")
                .userAge(50)
                .userPhone("01099998888")
                .userAddr("부산시 해운대구")
                .userPwd("pwd123!")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .userRole(SubscriberRole.ROLE_USER)
                .isHanaCert(false)
                .build();

        TBUser saved = userRepository.save(newUser);

        assertThat(saved.getUserId()).isNotNull();
        assertThat(userRepository.existsByLoginId("savetest01")).isTrue();
    }

    @Test
    @Order(25)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    @DisplayName("save: loginId 중복 저장 → DataIntegrityViolationException 발생")
    void save_duplicateLoginId_throwsException() {
        TBUser duplicate = TBUser.builder()
                .loginId("testuser01")
                .userNm("중복유저")
                .userAge(30)
                .userPhone("01011112222")
                .userAddr("서울시")
                .userPwd("pwd999!")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .userRole(SubscriberRole.ROLE_USER)
                .isHanaCert(false)
                .build();

        assertThatThrownBy(() -> userRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @Order(26)
    @DisplayName("findById: 존재하지 않는 ID → empty")
    void findById_notFound() {
        Optional<TBUser> result = userRepository.findById(Long.MAX_VALUE);

        assertThat(result).isEmpty();
    }

    @Test
    @Order(27)
    @DisplayName("deleteById: 저장된 유저 삭제 → 이후 조회 empty")
    void deleteById_success() {
        TBUser target = userRepository.findByLoginId("savetest01")
                .orElseThrow(() -> new IllegalStateException(
                        "savetest01 유저가 없습니다. Order 24(save_newUser)가 먼저 성공해야 합니다."));

        userRepository.deleteById(target.getUserId());

        assertThat(userRepository.existsByLoginId("savetest01")).isFalse();
    }
}
