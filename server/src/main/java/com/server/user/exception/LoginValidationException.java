package com.server.user.exception;

import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

@Getter
public class LoginValidationException extends AuthenticationException {

  private final String field;
  private final String violationMessage;

  public LoginValidationException(String field, String violationMessage) {
    super("[" + field + "] " + violationMessage);
    this.field = field;
    this.violationMessage = violationMessage;
  }
}
