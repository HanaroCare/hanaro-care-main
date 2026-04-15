package com.server.common.security;

import com.server.user.enums.LoginMeans;
import java.util.Collection;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class LoginAuthenticationToken extends AbstractAuthenticationToken {

  private final Object principal;
  private String credentials;
  private final LoginMeans means;

  public LoginAuthenticationToken(String loginId, String userPwd, LoginMeans means) {
    super(null);
    this.principal = loginId;
    this.credentials = userPwd;
    this.means = means;
    setAuthenticated(false);
  }

  public LoginAuthenticationToken(Object principal, LoginMeans means,
      Collection<? extends GrantedAuthority> authorities) {
    super(authorities);
    this.principal = principal;
    this.credentials = null;
    this.means = means;
    super.setAuthenticated(true);
  }

  @Override
  public Object getCredentials() {
    return this.credentials;
  }

  @Override
  public Object getPrincipal() {
    return this.principal;
  }

  public LoginMeans getMeans() {
    return this.means;
  }

  @Override
  public void eraseCredentials() {
    super.eraseCredentials();
    this.credentials = null;
  }
}