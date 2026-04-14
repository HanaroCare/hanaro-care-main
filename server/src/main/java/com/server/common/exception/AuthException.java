package com.server.common.exception;

import com.server.common.response.code.status.ErrorStatus;
import lombok.Getter;

@Getter
public class AuthException extends RuntimeException {

  private final ErrorStatus errorStatus;

  public AuthException(ErrorStatus errorStatus) {
    super(errorStatus.getMessage());
    this.errorStatus = errorStatus;
  }

  public String getCode() {
    return errorStatus.getCode();
  }
}
