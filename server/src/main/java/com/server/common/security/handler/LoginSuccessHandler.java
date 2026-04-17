package com.server.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.RefreshTokenRepository;
import com.server.auth.service.LoginLogService;
import com.server.common.security.JwtUtil;
import com.server.common.security.LoginAuthenticationToken;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final LoginLogService loginLogService;
  private final ObjectMapper objectMapper;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  @Override
  @Transactional
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException {

    LoginAuthenticationToken loginToken = (LoginAuthenticationToken) authentication;
    SubscriberDTO subscriber = (SubscriberDTO) loginToken.getPrincipal();
    LoginMeans means = loginToken.getMeans();

    TBUser user = userRepository.findById(subscriber.getUserId())
        .orElseThrow(() -> new AuthenticationServiceException("사용자를 찾을 수 없습니다."));

    Map<String, Object> claims = jwtUtil.authenticationToClaims(authentication);
    claims.put("isPasswordExpired", isPasswordExpired(user.getPwdChangedAt()));

    saveRefreshToken(user, (String) claims.get("refreshToken"));
    loginLogService.save(user, means, true);

    log.info("[로그인 성공] 계정: {}, 인증 수단: {}, 인증서 여부: {}, 비밀번호만료: {}",
        subscriber.getLoginId(), means.getDescription(), subscriber.isHanaCertYn(),
        claims.get("isPasswordExpired"));

    response.setContentType("application/json;charset=UTF-8");
    try (PrintWriter out = response.getWriter()) {
      out.println(objectMapper.writeValueAsString(claims));
    }
  }

  private static final long PASSWORD_EXPIRY_DAYS = 180L;

  private boolean isPasswordExpired(LocalDateTime pwdChangedAt) {
    // null 은 신규 가입 직후 상태 — 만료로 판정하지 않음
    if (pwdChangedAt == null) return false;
    return pwdChangedAt.isBefore(LocalDateTime.now().minusDays(PASSWORD_EXPIRY_DAYS));
  }

  private void saveRefreshToken(TBUser user, String refreshToken) {
    TBRefreshToken token = refreshTokenRepository.findById(user.getUserId())
        .orElseGet(() -> TBRefreshToken.builder().userId(user.getUserId()).build());

    token.setTokenValue(refreshToken);
    token.setExpiryDt(LocalDateTime.now().plusSeconds(refreshExpiration / 1000));
    refreshTokenRepository.save(token);
  }
}
