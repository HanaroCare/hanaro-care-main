package com.server.auth.service;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.TBRefreshTokenRepository;
import com.server.common.exception.CustomJwtException;
import com.server.common.security.AuthConstants;
import com.server.common.security.JwtUtil;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBUserRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

  private final TBUserRepository userRepository;
  private final TBRefreshTokenRepository refreshTokenRepository;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder passwordEncoder;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  /**
   * 1. 로그인
   */
  @Transactional(rollbackFor = {Exception.class, Error.class})
  public TokenResponseDTO login(LoginRequestDTO request) {

    TBUser user = userRepository.findByUserNm(request.getUserNm())
        .orElseThrow(() -> new CustomJwtException("유효하지 않은 사용자입니다.", "USER_NOT_FOUND"));

    if (!passwordEncoder.matches(request.getUserPwd(), user.getUserPwd())) {
      log.warn("로그인 실패: 비밀번호 불일치 - {}", request.getUserNm());
      throw new CustomJwtException("비밀번호가 일치하지 않습니다.", "BAD_CREDENTIALS");
    }

    SubscriberDTO subscriberDTO = createSubscriberDTO(user);
    String accessToken = jwtUtil.createAccessToken(subscriberDTO);
    String refreshToken = jwtUtil.createRefreshToken(subscriberDTO);

    saveRefreshToken(user, refreshToken);

    log.info("로그인 성공: {}", user.getUserNm());

    return TokenResponseDTO.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .grantType(AuthConstants.TOKEN_TYPE)
        .build();
  }

  /**
   * 2. 토큰 재발급
   */
  @Transactional(rollbackFor = {Exception.class, Error.class})
  public TokenResponseDTO refresh(String refreshTokenValue) {

    jwtUtil.validateToken(refreshTokenValue);

    TBRefreshToken storedToken = refreshTokenRepository.findByTokenValue(refreshTokenValue)
        .orElseThrow(() -> new CustomJwtException("유효하지 않은 토큰입니다.", "INVALID_TOKEN"));

    if (storedToken.getExpiryDt().isBefore(LocalDateTime.now())) {
      refreshTokenRepository.delete(storedToken);
      throw new CustomJwtException("토큰이 만료되었습니다.", "EXPIRED");
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

  /**
   * 3. 로그아웃
   */
  @Transactional
  public void logout(Long userId) {
    refreshTokenRepository.deleteById(userId);
    log.info("로그아웃 처리: 사용자 ID {}", userId);
  }

  private SubscriberDTO createSubscriberDTO(TBUser user) {
    return new SubscriberDTO(
        user.getUserId(),
        user.getUserNm(),
        user.getUserPwd(),
        Collections.emptyList()
    );
  }

  private void saveRefreshToken(TBUser user, String refreshToken) {
    TBRefreshToken tbRefreshToken = refreshTokenRepository.findById(user.getUserId())
        .orElse(null);

    if (tbRefreshToken == null) {
      tbRefreshToken = TBRefreshToken.builder()
          .userId(user.getUserId())
          .user(user)
          .tokenValue(refreshToken)
          .expiryDt(calculateExpiryDt())
          .build();
    } else {
      tbRefreshToken.setTokenValue(refreshToken);
      tbRefreshToken.setExpiryDt(calculateExpiryDt());
    }

    refreshTokenRepository.save(tbRefreshToken);
  }

  private LocalDateTime calculateExpiryDt() {
    return LocalDateTime.now().plusSeconds(refreshExpiration / 1000);
  }
}
