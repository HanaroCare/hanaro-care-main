package com.server.auth.service;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.SignUpRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.dto.UnlockDormantRequestDTO;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.RefreshTokenRepository;
import com.server.common.exception.ApiException;
import com.server.common.exception.CustomJwtException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.AuthConstants;
import com.server.common.security.JwtUtil;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.entity.TBUserSimpleAuth;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import com.server.user.repository.UserSimpleAuthRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
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
  private final LoginLogService loginLogService;
  private final UserSimpleAuthRepository simpleAuthRepository;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder passwordEncoder;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public void signUp(SignUpRequestDTO request) {
    if (userRepository.findByLoginId(request.getLoginId()).isPresent()) {
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
      throw new ApiException(ErrorStatus.AUTH_DUPLICATE_USERNAME);
    }

    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
      @Override
      public void afterCommit() {
        log.info("[회원가입 성공] loginId={}, userId={}, role={}", user.getLoginId(), user.getUserId(),
            user.getUserRole());
      }
    });
  }

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public TokenResponseDTO login(LoginRequestDTO request) {
    TBUser user = userRepository.findByLoginId(request.getLoginId())
        .orElseThrow(() -> new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS));

    if (user.getUserStatusCd() != UserStatus.ACTIVE) {
      log.warn("[로그인 실패] 비활성 계정 - loginId={}", user.getLoginId());
      loginLogService.save(user, request.getMeans(), false);
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }

    LoginMeans means = request.getMeans();
    verifyCredential(user, request.getUserPwd(), means);

    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
      @Override
      public void afterCommit() {
        loginLogService.save(user, means, true);
        log.info("[로그인 성공] loginId={}, means={}", user.getLoginId(), means.getDescription());
      }
    });

    return issueTokens(user);
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
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }

    LocalDateTime now = LocalDateTime.now();
    user.setUserStatusCd(UserStatus.ACTIVE);
    user.setUserPwd(passwordEncoder.encode(request.getNewUserPwd()));
    user.setPwdChangedAt(now);
    user.setLastLoginAt(now);
    userRepository.save(user);

    log.info("[휴면 해제] loginId={}", user.getLoginId());
  }

  private void verifyCredential(TBUser user, String inputSecret, LoginMeans means) {
    if (user.getAuthMeansCd() != means) {
      log.warn("[로그인 실패] 인증 수단 불일치 - loginId={}, registered={}, requested={}",
          user.getLoginId(), user.getAuthMeansCd(), means);
      loginLogService.save(user, means, false);
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }

    if (means == LoginMeans.PASSWORD) {
      if (!passwordEncoder.matches(inputSecret, user.getUserPwd())) {
        log.warn("[로그인 실패] 비밀번호 불일치 - loginId={}", user.getLoginId());
        loginLogService.save(user, means, false);
        throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
      }
      return;
    }

    if (!user.getIsHanaCert()) {
      log.warn("[간편 로그인 실패] 하나 인증 미완료 - loginId={}, means={}", user.getLoginId(),
          means.getDescription());
      loginLogService.save(user, means, false);
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }

    Optional<TBUserSimpleAuth> authOpt = simpleAuthRepository.findByUserAndAuthMeansCd(user, means);
    if (authOpt.isEmpty()) {
      log.warn("[간편 로그인 실패] 등록된 인증 정보 없음 - loginId={}, means={}", user.getLoginId(),
          means.getDescription());
      loginLogService.save(user, means, false);
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }

    if (!passwordEncoder.matches(inputSecret, authOpt.get().getAuthValue())) {
      log.warn("[간편 로그인 실패] 인증 값 불일치 - loginId={}, means={}", user.getLoginId(),
          means.getDescription());
      loginLogService.save(user, means, false);
      throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
    }
  }

  private TokenResponseDTO issueTokens(TBUser user) {
    SubscriberDTO subscriberDTO = createSubscriberDTO(user);
    String accessToken = jwtUtil.createAccessToken(subscriberDTO);
    String refreshToken = jwtUtil.createRefreshToken(subscriberDTO);

    saveRefreshToken(user, refreshToken);

    return TokenResponseDTO.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .grantType(AuthConstants.TOKEN_TYPE)
        .userRole(user.getUserRole().name())
        .userNm(user.getLoginId())
        .build();
  }

  private SubscriberDTO createSubscriberDTO(TBUser user) {
    return new SubscriberDTO(
        user.getUserId(),
        user.getLoginId(),
        "",
        user.getIsHanaCert(),
        Collections.singletonList(new SimpleGrantedAuthority(user.getUserRole().name()))
    );
  }

  private void saveRefreshToken(TBUser user, String refreshToken) {
    TBRefreshToken tbRefreshToken = refreshTokenRepository.findById(user.getUserId())
        .orElseGet(() -> TBRefreshToken.builder()
            .userId(user.getUserId())
            .build());

    tbRefreshToken.setTokenValue(refreshToken);
    tbRefreshToken.setExpiryDt(calculateExpiryDt());
    refreshTokenRepository.save(tbRefreshToken);
  }

  private LocalDateTime calculateExpiryDt() {
    return LocalDateTime.now().plusSeconds(refreshExpiration / 1000);
  }
}
