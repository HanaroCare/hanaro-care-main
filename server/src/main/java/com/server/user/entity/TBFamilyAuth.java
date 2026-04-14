package com.server.user.entity;

import com.server.card.entity.TBCard;
import com.server.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "TB_FAMILY_AUTH")
public class TBFamilyAuth extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  // @Tsid
  @Column(name = "FAMILY_AUTH_ID", columnDefinition = "bigint unsigned comment '가족 권한 고유 식별자'")
  private Long familyAuthId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "USER_GRANTOR_ID",
      referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_FamilyAuth_userGrantorId_User")
  )
  private TBUser grantor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "USER_GRANTEE_ID",
      referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_FamilyAuth_userGranteeId_User")
  )
  private TBUser grantee;

  @Column(name = "INS_VIEW_YN", nullable = false, length = 1)
  private String insViewYn;

  @Column(name = "AUTH_STATUS", nullable = false)
  private Boolean authStatus; // BOOLEAN (true: 승인, false: 거절/대기)

  @Column(name = "RELATION_CD", nullable = false)
  private Boolean relationCd; // BOOLEAN (부모/자녀 구분용)

  @Column(name = "CARD_VIEW_YN", nullable = false, length = 1)
  private String cardViewYn;


}
