package com.server.auth.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.SignUpRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.dto.UnlockDormantRequestDTO;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.RefreshTokenRepository;
import com.server.common.exception.ApiException;
import com.server.common.exception.CustomJwtException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.JwtUtil;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final SmsAuthService smsAuthService;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder passwordEncoder;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  /**
   * 아이디 중복 체크 UserRepository에 existsByLoginId가 선언되어 있어야 정상 작동합니다.
   */
  public void checkLoginId(String loginId) {
    if (userRepository.existsByLoginId(loginId)) {
      throw new ApiException(ErrorStatus.AUTH_DUPLICATE_USERNAME);
    }
  }

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public void signUp(SignUpRequestDTO request) {

    if (!smsAuthService.isVerified(request.getUserPhone())) {
      log.warn("[회원가입 실패] SMS 미인증 - phone={}", request.getUserPhone());
      throw new ApiException(ErrorStatus.SMS_NOT_VERIFIED);
    }

    if (userRepository.findByLoginId(request.getLoginId()).isPresent()) {
      log.warn("[회원가입 실패] 아이디 중복 - loginId={}", request.getLoginId());
      throw new ApiException(ErrorStatus.AUTH_DUPLICATE_USERNAME);
    }

    TBUser user = TBUser.builder()
        .loginId(request.getLoginId())
        .userNm(request.getUserNm())
        .userAge(request.getUserAge())
        .userPhone(request.getUserPhone())
        .userPwd(passwordEncoder.encode(request.getUserPwd()))
        .userStatusCd(UserStatus.ACTIVE)
        .isHanaCert(false)
        .build();

    try {
      userRepository.save(user);
    } catch (DataIntegrityViolationException e) {
      log.error("[회원가입 실패] DB 제약 조건 위반 - loginId={}", request.getLoginId());
      throw new ApiException(ErrorStatus.AUTH_DUPLICATE_USERNAME);
    }

    // 트랜잭션 커밋 후 SMS 인증 정보 삭제
    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
      @Override
      public void afterCommit() {
        smsAuthService.clearVerification(request.getUserPhone());
        log.info("[회원가입 성공] loginId={}, userId={}, role={}", user.getLoginId(), user.getUserId(),
            user.getUserRole());
      }
    });
  }

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public TokenResponseDTO refresh(String refreshTokenValue) {
    jwtUtil.validateToken(refreshTokenValue);

    TBRefreshToken storedToken = refreshTokenRepository.findByTokenValue(refreshTokenValue)
        .orElseThrow(() -> new CustomJwtException("AUTH_005", "유효하지 않은 토큰입니다."));

    if (storedToken.getExpiryDt().isBefore(LocalDateTime.now())) {
      refreshTokenRepository.delete(storedToken);
      throw new CustomJwtException("AUTH_006", "토큰이 만료되었습니다.");
    }

    TBUser user = storedToken.getUser();
    SubscriberDTO subscriberDTO = createSubscriberDTO(user);

    String newAccessToken = jwtUtil.createAccessToken(subscriberDTO);
    String newRefreshToken = jwtUtil.createRefreshToken(subscriberDTO);

    storedToken.setTokenValue(newRefreshToken);
    storedToken.setExpiryDt(calculateExpiryDt());
    refreshTokenRepository.save(storedToken);

    return TokenResponseDTO.builder()
        .accessToken(newAccessToken)
        .refreshToken(newRefreshToken)
        .build();
  }

  @Transactional
  public void logout(Long userId) {
    refreshTokenRepository.deleteById(userId);
    log.info("[로그아웃] userId={}", userId);
  }

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public void unlockDormant(UnlockDormantRequestDTO request) {
    TBUser user = userRepository.findByLoginId(request.getLoginId())
        .orElseThrow(() -> new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS));

    if (user.getUserStatusCd() != UserStatus.DORMANT) {
      log.warn("[휴면 해제 실패] 이미 활성 상태이거나 정지된 계정: loginId={}", request.getLoginId());
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }

    // SMS 인증 확인
    if (!smsAuthService.isVerified(user.getUserPhone())) {
      log.warn("[휴면 해제 실패] SMS 인증 미완료: loginId={}, phone={}", user.getLoginId(),
          user.getUserPhone());
      throw new ApiException(ErrorStatus.SMS_NOT_VERIFIED);
    }

    // 상태 변경 및 비번 갱신
    user.setUserStatusCd(UserStatus.ACTIVE);
    user.setUserPwd(passwordEncoder.encode(request.getNewUserPwd()));

    // 마지막 로그인 시간 등을 갱신 -> 바로 로그인 가능
    LocalDateTime now = LocalDateTime.now();
    user.setPwdChangedAt(now);
    user.setLastLoginAt(now);

    userRepository.save(user);

    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
      @Override
      public void afterCommit() {
        smsAuthService.clearVerification(user.getUserPhone());
        log.info("[휴면 해제 성공] 계정이 다시 활성화됨: loginId={}", user.getLoginId());
      }
    });
  }

  private SubscriberDTO createSubscriberDTO(TBUser user) {
    return new SubscriberDTO(
        user.getUserId(),
        user.getLoginId(),
        user.getUserNm(),
        "",
        user.getIsHanaCert(),
        Collections.singletonList(new SimpleGrantedAuthority(user.getUserRole().name()))
    );
  }

  private LocalDateTime calculateExpiryDt() {
    return LocalDateTime.now().plusSeconds(refreshExpiration / 1000);
  }
}
