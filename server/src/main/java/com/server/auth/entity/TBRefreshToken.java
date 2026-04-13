package com.server.auth.entity;

import com.server.user.entity.TBUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "user")
@Table(name = "TB_REFRESH_TOKEN")
public class TBRefreshToken {

  @Id
  @Column(name = "USER_ID", columnDefinition = "bigint unsigned")
  private Long userId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID", insertable = false, updatable = false) // 읽기 전용 연관관계
  private TBUser user;

  @Column(name = "TOKEN_VAL", nullable = false, length = 500)
  private String tokenValue;

  @Column(name = "EXPIRY_DT", nullable = false)
  private LocalDateTime expiryDt;

  public void setUser(TBUser user) {
    this.user = user;
    if (user != null) {
      this.userId = user.getUserId();
    }
  }
}
