package com.server.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.auth.entity.TBRefreshToken;
import com.server.auth.repository.TBRefreshTokenRepository;
import com.server.auth.service.LoginLogService;
import com.server.common.security.JwtUtil;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.enums.LoginMeans;
import com.server.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Map;
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
  private final TBRefreshTokenRepository refreshTokenRepository;
  private final LoginLogService loginLogService;
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  @Override
  @Transactional
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {

    SubscriberDTO subscriber = (SubscriberDTO) authentication.getPrincipal();

    TBUser user = userRepository.findById(subscriber.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found"));

    Map<String, Object> claims = jwtUtil.authenticationToClaims(authentication);
    claims.put("hanaCertYn", subscriber.isHanaCertYn());

    String refreshToken = (String) claims.get("refreshToken");
    saveRefreshToken(user, refreshToken);

    loginLogService.save(user, LoginMeans.PASSWORD, true);

    log.info("=================================================");
    log.info("[로그인 성공] 계정: {}, 인증서 여부: {}",
        subscriber.getUserNm(), subscriber.isHanaCertYn());
    log.info("=================================================");

    response.setContentType("application/json;charset=UTF-8");

    String jsonResponse = objectMapper.writeValueAsString(claims);

    log.info("[응답 데이터 발송] 유저: {}, 토큰 포함 여부: {}",
        claims.getOrDefault("userNm", "Unknown"),
        claims.containsKey("accessToken"));

    try (PrintWriter out = response.getWriter()) {
      out.println(jsonResponse);
    }
  }

  private void saveRefreshToken(TBUser user, String refreshToken) {
    TBRefreshToken token = refreshTokenRepository.findById(user.getUserId())
        .orElseGet(() -> TBRefreshToken.builder().userId(user.getUserId()).build());

    token.setTokenValue(refreshToken);
    token.setExpiryDt(LocalDateTime.now().plusSeconds(refreshExpiration / 1000));
    refreshTokenRepository.save(token);
  }
}
