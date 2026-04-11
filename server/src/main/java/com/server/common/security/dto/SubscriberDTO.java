package com.server.common.security.dto;

import java.util.Collection;
import java.util.Map;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

@Getter
public class SubscriberDTO extends User {

  private final Long userId;
  private final String userNm;

  public SubscriberDTO(Long userId, String userNm, String userPwd,
      Collection<? extends GrantedAuthority> authorities) {
    super(userNm, userPwd, authorities);
    this.userId = userId;
    this.userNm = userNm;
  }

  public Map<String, Object> getClaims() {
    return Map.of(
        "userId", userId,
        "userNm", userNm,
        "roles", getAuthorities().stream()
            .map(org.springframework.security.core.GrantedAuthority::getAuthority)
            .toList()
    );
  }
}
