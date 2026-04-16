package com.server.common.exception;

import org.springframework.security.core.AuthenticationException;

public class AccountDormantException extends AuthenticationException {

  public AccountDormantException() {
    super("AUTH_ACCOUNT_DORMANT");
  }
}
