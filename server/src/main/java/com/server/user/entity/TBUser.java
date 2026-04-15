package com.server.user.entity;

import com.server.user.enums.LoginMeans;
import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "TB_USER")
public class TBUser {

  @Id
  @Tsid
  @Column(name = "USER_ID", columnDefinition = "bigint unsigned")
  private Long userId;

  @Column(name = "USER_NM", nullable = false, length = 20)
  private String userNm;

  @Column(name = "USER_AGE", nullable = false)
  private Integer userAge;

  @Column(name = "USER_PHONE", nullable = false, length = 11)
  private String userPhone;

  @Column(name = "USER_PWD", nullable = false)
  private String userPwd;

  @Builder.Default
  @Column(name = "IS_HANA_CERT", nullable = false)
  private Boolean isHanaCert = false;

  @Enumerated(EnumType.STRING)
  @Column(name = "USER_STAT_CD", nullable = false, length = 20)
  private UserStatus userStatusCd;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  @Column(name = "AUTH_MEANS_CD", nullable = false, length = 20)
  private LoginMeans authMeansCd = LoginMeans.PASSWORD; // 기본값은 일반 로그인

  @Builder.Default
  @Enumerated(EnumType.STRING)
  @Column(name = "USER_ROLE", nullable = false, length = 20)
  private SubscriberRole userRole = SubscriberRole.ROLE_USER;

  @Column(name = "LAST_LOGIN_AT")
  private LocalDateTime lastLoginAt;

  @Column(name = "PWD_CHANGED_AT")
  private LocalDateTime pwdChangedAt;
}
