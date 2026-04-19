package com.server.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.server.BaseRepositoryTest;
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

    private static final String TEST_ID = "user_repo_test";

    private TBUser loadTestUser() {
        return userRepository.findByLoginId(TEST_ID)
                .orElseGet(() -> userRepository.save(TBUser.builder()
                        .loginId(TEST_ID)
                        .userNm("테스트유저")
                        .userAge(65)
                        .userPhone("01012345678")
                        .userAddr("서울시 강남구")
                        .userPwd("encodedPwd123!")
                        .userStatusCd(UserStatus.ACTIVE)
                        .authMeansCd(LoginMeans.PASSWORD)
                        .userRole(SubscriberRole.ROLE_USER)
                        .isHanaCert(false)
                        .build()));
    }

    @Test
    @Order(1)
    @DisplayName("findByLoginId: 존재하는 loginId → 유저 반환 및 필드 검증")
    void findByLoginId_success() {
        loadTestUser();
        Optional<TBUser> result = userRepository.findByLoginId(TEST_ID);

        assertThat(result).isPresent();
        assertThat(result.get().getUserNm()).isEqualTo("테스트유저");
        assertThat(result.get().getUserPhone()).isEqualTo("01012345678");
        assertThat(result.get().getUserStatusCd()).isEqualTo(UserStatus.ACTIVE);
    }

    @Test
    @Order(2)
    @DisplayName("existsByLoginId: 존재하는 loginId → true")
    void existsByLoginId_true() {
        loadTestUser();
        assertThat(userRepository.existsByLoginId(TEST_ID)).isTrue();
    }

    @Test
    @Order(3)
    @DisplayName("findByLoginIdAndUserPhone: loginId·전화번호 모두 일치 → 유저 반환")
    void findByLoginIdAndUserPhone_success() {
        loadTestUser();
        Optional<TBUser> result =
                userRepository.findByLoginIdAndUserPhone(TEST_ID, "01012345678");

        assertThat(result).isPresent();
    }

    @Test
    @Order(4)
    @DisplayName("findUserPhoneByUserId: userId → 전화번호 반환")
    void findUserPhoneByUserId() {
        Long userId = loadTestUser().getUserId();
        String phone = userRepository.findUserPhoneByUserId(userId);
        assertThat(phone).isEqualTo("01012345678");
    }

    @Test
    @Order(5)
    @DisplayName("searchAdminUsers: 이름 키워드 → 결과 포함")
    void searchAdminUsers_byName() {
        loadTestUser();
        List<TBUser> result = userRepository.searchAdminUsers("테스트");
        assertThat(result).isNotEmpty();
    }

    @Test
    @Order(6)
    @DisplayName("save: loginId 중복 저장 → DataIntegrityViolationException 발생")
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void save_duplicateLoginId_throwsException() {
        loadTestUser();
        TBUser duplicate = TBUser.builder()
                .loginId(TEST_ID)
                .userNm("중복유저")
                .userAge(30)
                .userPhone("01011112222")
                .userPwd("pwd999!")
                .userStatusCd(UserStatus.ACTIVE)
                .authMeansCd(LoginMeans.PASSWORD)
                .userRole(SubscriberRole.ROLE_USER)
                .isHanaCert(false)
                .build();

        assertThatThrownBy(() -> userRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
