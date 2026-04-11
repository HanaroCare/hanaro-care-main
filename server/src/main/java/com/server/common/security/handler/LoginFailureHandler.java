package com.server.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginFailureHandler implements AuthenticationFailureHandler {

  @Override
  public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException exception) throws IOException, ServletException {

    log.error("=================================================");
    log.error("[로그인 실패] 인증 에러 발생!");
    log.error("에러 사유: {}", exception.getMessage());
    log.error("=================================================");

    ObjectMapper objMapper = new ObjectMapper();
    response.setContentType("application/json;charset=UTF-8");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    PrintWriter out = response.getWriter();
    out.println(objMapper.writeValueAsString(Map.of(
        "error", "ERROR_LOGIN",
        "message", "아이디 또는 비밀번호가 일치하지 않습니다."
    )));
    out.close();
  }
}