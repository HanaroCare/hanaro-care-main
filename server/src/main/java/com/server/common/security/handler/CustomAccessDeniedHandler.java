package com.server.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
@Log4j2
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response,
      org.springframework.security.access.AccessDeniedException accessDeniedException)
      throws IOException, ServletException {

    log.error("[권한 에러] 관리자 권한 부족! 접근 경로: {}", request.getRequestURI());

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");
    response.setStatus(HttpStatus.FORBIDDEN.value());

    Map<String, Object> map = new HashMap<>();
    map.put("error", "ACCESS_DENIED");
    map.put("message", "관리자 권한이 필요합니다. 관리자만 접근 가능합니다.");
    map.put("path", request.getRequestURI());

    ObjectMapper objectMapper = new ObjectMapper();
    PrintWriter pw = response.getWriter();
    pw.println(objectMapper.writeValueAsString(
        Map.of("error", "ERROR_ACCESS_DEINED")));
    pw.close();

    // throw new UnsupportedOperationException("Unimplemented method 'handle'");
  }
}