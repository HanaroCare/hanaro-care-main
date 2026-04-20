package com.server.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.server.BaseRepositoryTest;
import com.server.TestInitLoader;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.RefreshTokenRepository;
import com.server.auth.repository.TBRefreshTokenRepository;
import com.server.user.entity.TBUser;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@DisplayName("RefreshTokenRepository 테스트")
class RefreshTokenRepositoryTest extends BaseRepositoryTest {

  @Autowired
  private RefreshTokenRepository refreshTokenRepository;

  @Autowired
  private TBRefreshTokenRepository tbRefreshTokenRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private TestInitLoader testInitLoader;

  private static final String TOKEN_VALUE = "header.payload.signature_test_token_abc";
  private static final String TOKEN_VALUE_2 = "header.payload.signature_test_token_def";

  @Test
  @Order(1)
  @DisplayName("save: testUser의 리프레시 토큰 저장 → userId로 조회 가능")
  void save_success() {
    Long userId = testInitLoader.getTestUser().getUserId();

    TBRefreshToken token = TBRefreshToken.builder()
        .userId(userId)
        .tokenValue(TOKEN_VALUE)
        .expiryDt(LocalDateTime.now().plusDays(7))
        .build();

    TBRefreshToken saved = refreshTokenRepository.save(token);

    assertThat(saved.getUserId()).isEqualTo(userId);
    assertThat(saved.getTokenValue()).isEqualTo(TOKEN_VALUE);
  }

  @Test
  @Order(2)
  @DisplayName("findByTokenValue: 저장된 토큰값으로 조회 → 토큰 반환")
  void findByTokenValue_success() {
    Optional<TBRefreshToken> result = refreshTokenRepository.findByTokenValue(TOKEN_VALUE);

    assertThat(result).isPresent();
    assertThat(result.get().getTokenValue()).isEqualTo(TOKEN_VALUE);
    assertThat(result.get().getUserId()).isEqualTo(testInitLoader.getTestUser().getUserId());
  }

  @Test
  @Order(3)
  @DisplayName("findByTokenValue: 존재하지 않는 토큰값 → empty Optional")
  void findByTokenValue_notFound() {
    Optional<TBRefreshToken> result =
        refreshTokenRepository.findByTokenValue("nonexistent.token.value");

    assertThat(result).isEmpty();
  }

  @Test
  @Order(4)
  @DisplayName("findById: userId(PK)로 토큰 조회 → 반환")
  void findById_success() {
    Long userId = testInitLoader.getTestUser().getUserId();

    Optional<TBRefreshToken> result = refreshTokenRepository.findById(userId);

    assertThat(result).isPresent();
    assertThat(result.get().getUserId()).isEqualTo(userId);
  }

  @Test
  @Order(5)
  @DisplayName("findById: 존재하지 않는 userId → empty")
  void findById_notFound() {
    Optional<TBRefreshToken> result = refreshTokenRepository.findById(Long.MAX_VALUE);

    assertThat(result).isEmpty();
  }

  @Test
  @Order(6)
  @DisplayName("existsById: 저장된 userId → true")
  void existsById_true() {
    Long userId = testInitLoader.getTestUser().getUserId();

    assertThat(refreshTokenRepository.existsById(userId)).isTrue();
  }

  @Test
  @Order(7)
  @DisplayName("existsById: 존재하지 않는 userId → false")
  void existsById_false() {
    assertThat(refreshTokenRepository.existsById(Long.MAX_VALUE)).isFalse();
  }

  @Test
  @Order(8)
  @DisplayName("findAll: 저장된 토큰 목록 반환")
  void findAll_returnsTokens() {
    List<TBRefreshToken> result = refreshTokenRepository.findAll();

    assertThat(result).isNotEmpty();
    assertThat(result).anyMatch(t -> t.getTokenValue().equals(TOKEN_VALUE));
  }

  @Test
  @Order(9)
  @DisplayName("count: 저장된 토큰 수 1 이상")
  void count_greaterThanZero() {
    assertThat(refreshTokenRepository.count()).isGreaterThan(0);
  }

  @Test
  @Order(10)
  @Transactional(propagation = Propagation.NOT_SUPPORTED)
  @DisplayName("save: 동일 tokenValue 중복 저장 → DataIntegrityViolationException 발생")
  void save_duplicateTokenValue_throwsException() {
    // 별도 유저를 생성해 PK(userId) 충돌 없이 tokenValue unique 위반만 발생시킴
    TBUser extraUser = userRepository.findByLoginId("token_dup_user").orElseGet(() ->
        userRepository.save(TBUser.builder()
            .loginId("token_dup_user")
            .userNm("토큰중복유저")
            .userAge(35)
            .userPhone("01077776666")
            .userAddr("인천시")
            .userPwd("pwd_dup!")
            .userStatusCd(UserStatus.ACTIVE)
            .build())
    );

    TBRefreshToken duplicate = TBRefreshToken.builder()
        .userId(extraUser.getUserId())
        .tokenValue(TOKEN_VALUE)   // Order(1)에서 이미 저장된 tokenValue
        .expiryDt(LocalDateTime.now().plusDays(1))
        .build();

    assertThatThrownBy(() -> refreshTokenRepository.saveAndFlush(duplicate))
        .isInstanceOf(DataIntegrityViolationException.class);

    // 테스트 중 생성한 유저 정리 (NOT_SUPPORTED이므로 수동 삭제)
    userRepository.deleteById(extraUser.getUserId());
  }

  @Test
  @Order(11)
  @DisplayName("save: 만료 시각이 과거인 토큰도 저장 가능")
  void save_expiredToken_doesNotThrow() {
    // 만료 처리는 애플리케이션 레이어 책임이며 DB는 제약 없음을 확인
    Long userId = testInitLoader.getTestUser().getUserId();

    // 기존 토큰 삭제 후 만료된 토큰으로 교체
    refreshTokenRepository.deleteById(userId);

    TBRefreshToken expiredToken = TBRefreshToken.builder()
        .userId(userId)
        .tokenValue(TOKEN_VALUE_2)
        .expiryDt(LocalDateTime.now().minusDays(1))
        .build();

    TBRefreshToken saved = refreshTokenRepository.save(expiredToken);
    assertThat(saved.getExpiryDt()).isBefore(LocalDateTime.now());
  }


  @Test
  @Order(12)
  @DisplayName("TBRefreshTokenRepository.findByTokenValue: TOKEN_VALUE_2 조회 → 반환")
  void tbRepo_findByTokenValue_success() {
    Optional<TBRefreshToken> result =
        tbRefreshTokenRepository.findByTokenValue(TOKEN_VALUE_2);

    assertThat(result).isPresent();
    assertThat(result.get().getTokenValue()).isEqualTo(TOKEN_VALUE_2);
  }

  @Test
  @Order(13)
  @DisplayName("TBRefreshTokenRepository.findByTokenValue: 없는 값 → empty")
  void tbRepo_findByTokenValue_notFound() {
    Optional<TBRefreshToken> result =
        tbRefreshTokenRepository.findByTokenValue("ZZZNO.SUCH.TOKEN");

    assertThat(result).isEmpty();
  }

  @Test
  @Order(14)
  @DisplayName("TBRefreshTokenRepository.findById: userId(PK)로 조회 → 반환")
  void tbRepo_findById_success() {
    Long userId = testInitLoader.getTestUser().getUserId();

    Optional<TBRefreshToken> result = tbRefreshTokenRepository.findById(userId);

    assertThat(result).isPresent();
  }

  @Test
  @Order(15)
  @DisplayName("TBRefreshTokenRepository.existsById: 저장된 userId → true")
  void tbRepo_existsById_true() {
    Long userId = testInitLoader.getTestUser().getUserId();

    assertThat(tbRefreshTokenRepository.existsById(userId)).isTrue();
  }

  @Test
  @Order(16)
  @DisplayName("deleteById: 저장된 토큰 삭제 → 이후 findByTokenValue empty")
  void deleteById_success() {
    Long userId = testInitLoader.getTestUser().getUserId();

    refreshTokenRepository.deleteById(userId);

    assertThat(refreshTokenRepository.findByTokenValue(TOKEN_VALUE_2)).isEmpty();
    assertThat(refreshTokenRepository.existsById(userId)).isFalse();
  }
}
