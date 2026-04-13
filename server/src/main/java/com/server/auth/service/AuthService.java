package com.server.auth.service;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.SignUpRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.TBRefreshTokenRepository;
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
import com.server.user.repository.TBUserRepository;
import com.server.user.repository.TBUserSimpleAuthRepository;
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

  private final TBUserRepository userRepository;
  private final TBRefreshTokenRepository refreshTokenRepository;
  private final LoginLogService loginLogService;
  private final TBUserSimpleAuthRepository simpleAuthRepository;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder passwordEncoder;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public void signUp(SignUpRequestDTO request) {
    if (userRepository.findByUserNm(request.getUserNm()).isPresent()) {
      throw new ApiException(ErrorStatus.AUTH_DUPLICATE_USERNAME);
    }

    TBUser user = TBUser.builder()
        .userNm(request.getUserNm())
        .userAge(request.getUserAge())
        .userPhone(request.getUserPhone())
        .userPwd(passwordEncoder.encode(request.getUserPwd()))
        .userStatusCd(UserStatus.ACTIVE)
        .hanaCertYn(false)
        .build();

    try {
      userRepository.save(user);
    } catch (DataIntegrityViolationException e) {
      throw new ApiException(ErrorStatus.AUTH_DUPLICATE_USERNAME);
    }

    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
      @Override
      public void afterCommit() {
        log.info("[회원가입 성공] userNm={}, userId={}, role={}", user.getUserNm(), user.getUserId(), user.getUserRole());
      }
    });
  }

  @Transactional(rollbackFor = {Exception.class, Error.class})
  public TokenResponseDTO login(LoginRequestDTO request) {
    TBUser user = userRepository.findByUserNm(request.getUserNm())
        .orElseThrow(() -> new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS));

    LoginMeans means = Optional.ofNullable(request.getMeans()).orElse(LoginMeans.PASSWORD);

    verifyCredential(user, request.getUserPwd(), means);

    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
      @Override
      public void afterCommit() {
        loginLogService.save(user, means, true);
        log.info("[로그인 성공] userNm={}, means={}", user.getUserNm(), means.getDescription());
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

  private void verifyCredential(TBUser user, String inputSecret, LoginMeans means) {
    if (means == LoginMeans.PASSWORD) {
      if (!passwordEncoder.matches(inputSecret, user.getUserPwd())) {
        log.warn("[로그인 실패] 비밀번호 불일치 - userNm={}, means={}", user.getUserNm(), means.getDescription());
        loginLogService.save(user, means, false);
        throw new ApiException(ErrorStatus.AUTH_BAD_CREDENTIALS);
      }
      return;
    }

    if (!user.isHanaCertYn()) {
      log.warn("[간편 로그인 실패] 하나 인증 미완료 - userNm={}, means={}", user.getUserNm(), means.getDescription());
      loginLogService.save(user, means, false);
      throw new ApiException(ErrorStatus.AUTH_CERT_REQUIRED);
    }

    Optional<TBUserSimpleAuth> authOpt = simpleAuthRepository.findByUserAndAuthMeansCd(user, means);
    if (authOpt.isEmpty()) {
      log.warn("[간편 로그인 실패] 등록된 인증 정보 없음 - userNm={}, means={}", user.getUserNm(), means.getDescription());
      loginLogService.save(user, means, false);
      throw new ApiException(ErrorStatus.AUTH_SIMPLE_NOT_REGISTERED);
    }

    if (!passwordEncoder.matches(inputSecret, authOpt.get().getAuthValue())) {
      log.warn("[간편 로그인 실패] 인증 값 불일치 - userNm={}, means={}", user.getUserNm(), means.getDescription());
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
        .userNm(user.getUserNm())
        .build();
  }

  private SubscriberDTO createSubscriberDTO(TBUser user) {
    return new SubscriberDTO(
        user.getUserId(),
        user.getUserNm(),
        user.getUserPwd(),
        user.isHanaCertYn(),
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
