package com.server.common.exception;

import org.springframework.security.core.AuthenticationException;

public class AccountSuspendedException extends AuthenticationException {

  public AccountSuspendedException() {
    super("AUTH_ACCOUNT_SUSPENDED");
  }
}
