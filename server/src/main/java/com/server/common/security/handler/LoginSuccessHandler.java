package com.server.common.security.handler;

import com.server.common.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final JwtUtil jwtUtil;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {

    String username = authentication.getName();

    log.info("=================================================");
    log.info("[로그인 성공] 로그인에 성공하였습니다!");
    log.info("접속 계정: {}", username);
    log.info("권한 정보: {}", authentication.getAuthorities());
    log.info("=================================================");

    Map<String, Object> claims = jwtUtil.authenticationToClaims(authentication);

    ObjectMapper objMapper = new ObjectMapper();
    response.setContentType("application/json;charset=UTF-8");

    String jsonResponse = objMapper.writeValueAsString(claims);

    log.info("[응답 데이터 발송] 유저: {}, 토큰 포함 여부: {}",
        claims.get("userNm"),
        claims.containsKey("accessToken"));

    PrintWriter out = response.getWriter();
    out.println(jsonResponse);
    out.close();
  }
}
