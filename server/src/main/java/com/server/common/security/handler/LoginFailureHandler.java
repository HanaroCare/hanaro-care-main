package com.server.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.common.exception.AccountDormantException;
import com.server.common.exception.AccountSuspendedException;
import com.server.common.exception.AccountWithdrawnException;
import com.server.user.exception.LoginValidationException;
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

  private final ObjectMapper objectMapper;

  @Override
  public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException exception) throws IOException {

    String code;
    String message;
    int status;

    if (exception instanceof LoginValidationException validationEx) {
      log.warn("[로그인 입력값 오류] field={}, violation={}", validationEx.getField(),
          validationEx.getViolationMessage());
      code = "COMMON400";
      message = validationEx.getMessage();
      status = HttpServletResponse.SC_BAD_REQUEST; // 400 Bad Request
    } else if (exception instanceof AccountSuspendedException) {
      log.warn("[로그인 실패] {}", exception.getMessage());
      code = "AUTH_008";
      message = "이용이 정지된 계정입니다. 고객센터에 문의해주세요.";
      status = HttpServletResponse.SC_FORBIDDEN; // 403 Forbidden
    } else if (exception instanceof AccountDormantException) {
      log.warn("[로그인 실패] {}", exception.getMessage());
      code = "AUTH_009";
      message = "휴면 계정입니다. 본인인증을 통해 계정을 복구해 주세요.";
      status = HttpServletResponse.SC_FORBIDDEN; // 403 Forbidden
    } else if (exception instanceof AccountWithdrawnException) {
      log.warn("[로그인 실패] {}", exception.getMessage());
      code = "AUTH_015";
      message = "탈퇴 처리된 계정입니다.";
      status = HttpServletResponse.SC_FORBIDDEN; // 403 Forbidden
    } else {
      log.warn("[로그인 실패] {}", exception.getMessage());
      code = "AUTH_001";
      message = "아이디 또는 비밀번호가 일치하지 않습니다.";
      status = HttpServletResponse.SC_UNAUTHORIZED; // 401 Unauthorized
    }

    response.setContentType("application/json;charset=UTF-8");
    response.setStatus(status);

    Map<String, Object> body = Map.of(
        "isSuccess", false,
        "code", code,
        "message", message
    );

    try (PrintWriter out = response.getWriter()) {
      out.println(objectMapper.writeValueAsString(body));
    }
  }
}
