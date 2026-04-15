package com.server.common.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.auth.dto.LoginRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.util.StringUtils;

public class CustomJsonLoginFilter extends AbstractAuthenticationProcessingFilter {

  private final ObjectMapper objectMapper = new ObjectMapper();

  public CustomJsonLoginFilter() {
    super("/api/auth/login");
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
      HttpServletResponse response) throws AuthenticationException, IOException {

    if (request.getContentType() == null || !request.getContentType()
        .contains("application/json")) {
      throw new AuthenticationServiceException(
          "지원되지 않는 Content-Type입니다: " + request.getContentType());
    }

    LoginRequestDTO loginRequest = objectMapper.readValue(request.getInputStream(),
        LoginRequestDTO.class);

    if (loginRequest == null) {
      throw new AuthenticationServiceException("요청 본문(JSON)이 비어있습니다.");
    }

    if (loginRequest.getMeans() == null) {
      throw new AuthenticationServiceException("인증 수단은 필수입니다.");
    }

    if (!StringUtils.hasText(loginRequest.getLoginId()) || !StringUtils.hasText(
        loginRequest.getUserPwd())) {
      throw new AuthenticationServiceException("아이디와 인증 값은 필수입니다.");
    }

    return this.getAuthenticationManager().authenticate(
        new LoginAuthenticationToken(
            loginRequest.getLoginId(),
            loginRequest.getUserPwd(),
            loginRequest.getMeans()
        )
    );
  }
}
