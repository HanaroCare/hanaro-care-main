package com.server.common.security.handler;

import com.server.common.security.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final JwtUtil jwtUtil;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {
    System.out.println("*** SuccessHandler.auth=" + authentication);

    Map<String, Object> claims = jwtUtil.authenticationToClaims(authentication);

    ObjectMapper objMapper = new ObjectMapper();
    response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    out.println(objMapper.writeValueAsString(claims));
    out.close();
  }
}
