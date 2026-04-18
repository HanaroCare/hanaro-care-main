package com.server.user.entity;

import com.server.common.entity.BaseEntity;
import com.server.user.enums.LoginMeans;

import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@EqualsAndHashCode(callSuper = true)
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "TB_USER_LOGIN_LOG")
public class TBUserLoginLog extends BaseEntity {

  @Id
  @Tsid
  @Column(name = "USER_LOG_ID", columnDefinition = "bigint unsigned")
  private Long userLogId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "USER_ID",
      referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_UserLoginLog_userId_User")
  )
  @OnDelete(action = OnDeleteAction.CASCADE)
  private TBUser user;

  @Enumerated(EnumType.STRING)
  @Column(name = "USER_MEANS_CD", nullable = false, length = 20)
  private LoginMeans userMeansCd;

  @Column(name = "IS_SUCCESS", nullable = false)
  private Boolean isSuccess;

  @Column(name = "ACCESS_IP_ADDR", length = 50)
  private String accessIpAddr;

  @Column(name = "ACCESS_DEV_NM")
  private String accessDevNm;
}
