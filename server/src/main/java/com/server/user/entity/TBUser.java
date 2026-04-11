package com.server.user.entity;

import com.server.user.enums.UserStatus;
import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

  @Column(name = "USER_PWD", nullable = false, length = 255)
  private String userPwd;

  @Builder.Default
  @Column(name = "HANA_CERT_YN", nullable = false, length = 1)
  private String hanaCertYn = "N";

  @Enumerated(EnumType.STRING)
  @Column(name = "USER_STAT_CD", nullable = false, length = 20)
  private UserStatus userStatusCd; // 활동(01), 정지(02), 휴면(03)

}
