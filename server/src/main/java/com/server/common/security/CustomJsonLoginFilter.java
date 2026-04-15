package com.server.common.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.auth.dto.LoginRequestDTO;
import com.server.common.exception.LoginValidationException;
import com.server.common.validator.AuthPatternValidator;
import com.server.common.validator.FaceIdValidator;
import com.server.common.validator.LoginIdValidator;
import com.server.common.validator.PasswordValidator;
import com.server.common.validator.PinValidator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.util.StringUtils;

public class CustomJsonLoginFilter extends AbstractAuthenticationProcessingFilter {

  private static final LoginIdValidator LOGIN_ID_VALIDATOR = new LoginIdValidator();
  private static final PasswordValidator PASSWORD_VALIDATOR = new PasswordValidator();
  private static final PinValidator PIN_VALIDATOR = new PinValidator();
  private static final AuthPatternValidator PATTERN_VALIDATOR = new AuthPatternValidator();
  private static final FaceIdValidator FACE_ID_VALIDATOR = new FaceIdValidator();

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

    validateLoginRequest(loginRequest);

    return this.getAuthenticationManager().authenticate(
        new LoginAuthenticationToken(
            loginRequest.getLoginId(),
            loginRequest.getUserPwd(),
            loginRequest.getMeans()
        )
    );
  }

  /**
   * loginId 형식 검증 및 means별 userPwd 형식 검증.
   * 검증 실패 시 LoginValidationException을 던져 LoginFailureHandler로 전달합니다.
   */
  private void validateLoginRequest(LoginRequestDTO dto) {
    if (!LOGIN_ID_VALIDATOR.isValid(dto.getLoginId(), null)) {
      throw new LoginValidationException("loginId",
          "아이디는 4자 이상 20자 이하의 영문자와 숫자만 사용할 수 있습니다.");
    }

    String userPwd = dto.getUserPwd();
    switch (dto.getMeans()) {
      case PASSWORD -> {
        if (!PASSWORD_VALIDATOR.isValid(userPwd, null)) {
          throw new LoginValidationException("userPwd",
              "비밀번호는 영문, 숫자, 특수문자(@$!%*#?&)를 포함한 8~16자여야 합니다.");
        }
      }
      case SIMPLE_PASSWORD -> {
        if (!PIN_VALIDATOR.isValid(userPwd, null)) {
          throw new LoginValidationException("userPwd", "간편비밀번호는 숫자 6자리여야 합니다.");
        }
      }
      case PATTERN -> {
        if (!PATTERN_VALIDATOR.isValid(userPwd, null)) {
          throw new LoginValidationException("userPwd", "패턴은 최소 4개 이상의 점을 연결해야 합니다.");
        }
      }
      case FACEID -> {
        if (!FACE_ID_VALIDATOR.isValid(userPwd, null)) {
          throw new LoginValidationException("userPwd", "생체 인증 정보가 유효하지 않습니다.");
        }
      }
    }
  }
}
