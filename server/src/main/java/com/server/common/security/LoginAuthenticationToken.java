package com.server.common.security;

import com.server.user.enums.LoginMeans;
import java.util.Collection;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class LoginAuthenticationToken extends AbstractAuthenticationToken {

  private final Object principal;
  private final String credentials;
  private final LoginMeans means;

  public LoginAuthenticationToken(String userNm, String userPwd, LoginMeans means) {
    super(null);
    this.principal = userNm;
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
    setAuthenticated(true);
  }

  @Override
  public Object getCredentials() {
    return credentials;
  }

  @Override
  public Object getPrincipal() {
    return principal;
  }

  public LoginMeans getMeans() {
    return means;
  }
}
