package com.server.common.security.dto;

import java.util.Collection;
import java.util.Map;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

@Getter
public class SubscriberDTO extends User {

  private final Long userId;
  private final String loginId;
  private final String userNm;
  private final boolean hanaCertYn;

  public SubscriberDTO(Long userId, String loginId, String userNm, String password,
      boolean hanaCertYn,
      Collection<? extends GrantedAuthority> authorities) {
    super(loginId, password, authorities);
    this.userId = userId;
    this.loginId = loginId;
    this.userNm = userNm;
    this.hanaCertYn = hanaCertYn;
  }

  public Map<String, Object> getClaims() {
    return Map.of(
        "userId", userId,
        "loginId", loginId,
        "userNm", userNm,
        "hanaCertYn", hanaCertYn,
        "roles", getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList()
    );
  }
}
