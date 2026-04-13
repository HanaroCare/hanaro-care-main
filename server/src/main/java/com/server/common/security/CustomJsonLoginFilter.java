package com.server.common.security;

import com.server.auth.dto.LoginRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

public class CustomJsonLoginFilter extends AbstractAuthenticationProcessingFilter {

  private final ObjectMapper objectMapper = new ObjectMapper();

  public CustomJsonLoginFilter() {
    super("/api/auth/login");
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
      HttpServletResponse response)
      throws AuthenticationException, IOException {

    if (request.getContentType() == null || !request.getContentType()
        .contains("application/json")) {
      throw new AuthenticationServiceException(
          "지원되지 않는 Content-Type입니다: " + request.getContentType());
    }

    LoginRequestDTO loginRequest = objectMapper.readValue(request.getInputStream(),
        LoginRequestDTO.class);

    UsernamePasswordAuthenticationToken authRequest =
        new UsernamePasswordAuthenticationToken(loginRequest.getUserNm(),
            loginRequest.getUserPwd());

    return this.getAuthenticationManager().authenticate(authRequest);
  }

}
