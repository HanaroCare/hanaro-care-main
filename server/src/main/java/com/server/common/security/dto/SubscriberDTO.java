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
  private final boolean isHanaCert;

  public SubscriberDTO(Long userId, String userNm, String userPwd, boolean isHanaCert,
      Collection<? extends GrantedAuthority> authorities) {
    super(userNm, userPwd, authorities);
    this.userId = userId;
    this.userNm = userNm;
    this.isHanaCert = isHanaCert;
  }

  public Map<String, Object> getClaims() {
    return Map.of(
        "userId", userId,
        "userNm", userNm,
        "isHanaCert", isHanaCert,
        "roles", getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList()
    );
  }
}
