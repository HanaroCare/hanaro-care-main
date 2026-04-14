package com.server.user.entity;

import com.server.user.enums.SubscriberRole;
import com.server.user.enums.UserStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  // @Tsid
  @Column(name = "USER_ID", columnDefinition = "bigint unsigned")
  private Long userId;

  @Column(name = "USER_NM", nullable = false, length = 20, unique = true)
  private String userNm;

  @Column(name = "USER_AGE", nullable = false)
  private Integer userAge;

  @Column(name = "USER_PHONE", nullable = false, length = 11)
  private String userPhone;

  @Column(name = "USER_PWD", nullable = false, length = 255)
  private String userPwd;

  @Builder.Default
  @Column(name = "HANA_CERT_YN", nullable = false)
  private boolean hanaCertYn = false;

  @Enumerated(EnumType.STRING)
  @Column(name = "USER_STAT_CD", nullable = false, length = 20)
  private UserStatus userStatusCd;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  @Column(name = "USER_ROLE", nullable = false, length = 20)
  private SubscriberRole userRole = SubscriberRole.ROLE_USER;
}
