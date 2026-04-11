package com.server.auth.entity;

import com.server.user.entity.TBUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "TB_REFRESH_TOKEN")
public class TBRefreshToken {

  @Id
  @Column(name = "USER_ID", columnDefinition = "bigint unsigned")
  private Long userId;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  @JoinColumn(name = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_RefreshToken_userId_User"))
  private TBUser user;

  @Column(name = "TOKEN_VAL", nullable = false, length = 500)
  private String tokenValue;

  @Column(name = "EXPIRY_DT", nullable = false)
  private LocalDateTime expiryDt;

}
