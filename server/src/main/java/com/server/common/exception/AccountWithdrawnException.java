package com.server.common.exception;

import org.springframework.security.core.AuthenticationException;

public class AccountWithdrawnException extends AuthenticationException {

  public AccountWithdrawnException() {
    super("AUTH_ACCOUNT_DELETED");
  }
}
