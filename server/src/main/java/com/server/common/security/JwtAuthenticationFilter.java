package com.server.common.security;

import com.server.common.exception.CustomJwtException;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final ObjectMapper objectMapper;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    String header = request.getHeader(AuthConstants.AUTH_HEADER);

    if (header != null && header.startsWith(AuthConstants.TOKEN_PREFIX)) {
      String token = header.substring(AuthConstants.TOKEN_PREFIX.length());

      try {
        // 1. 토큰 검증
        jwtUtil.validateToken(token);

        // 2. DB 조회 없이 Claims에서 정보 추출하여 SubscriberDTO 생성
        SubscriberDTO subscriberDTO = jwtUtil.getSubscriber(token);

        // 3. SecurityContext에 등록
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(subscriberDTO, null,
                subscriberDTO.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
      } catch (CustomJwtException e) {
        // 인증 필터 단계에서 발생한 CustomJwtException 처리 (EXPIRED, INVALID)
        SecurityContextHolder.clearContext();
        sendErrorResponse(response, e);
      }
    } else {
      filterChain.doFilter(request, response);
    }
  }

  private void sendErrorResponse(HttpServletResponse response, CustomJwtException e)
      throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");

    ApiResponse<Object> body = ApiResponse.onFailure(e.getErrorCode(), e.getMessage(), null);
    response.getWriter().write(objectMapper.writeValueAsString(body));
  }
}
