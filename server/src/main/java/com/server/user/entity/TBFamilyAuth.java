package com.server.user.entity;

import com.server.card.entity.TBCard;
import com.server.common.entity.BaseEntity;
import com.server.user.enums.FamilyRelation;
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
  @Tsid
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

  @Builder.Default
  @Column(name = "IS_INS_VIEW", nullable = false)
  private Boolean isInsView = false;

  @Column(name = "AUTH_STATUS", nullable = false)
  private Boolean authStatus; // BOOLEAN (true: 승인, false: 거절/대기)

  @Enumerated(EnumType.STRING)
  @Column(name = "RELATION_CD", nullable = false)
  private FamilyRelation relationCd; // ENUM (01: 배우자, 02: 자녀, 03: 부모, 04: 기타 가족)

  @Builder.Default
  @Column(name = "IS_CARD_VIEW", nullable = false)
  private Boolean isCardView = false;

  @Builder.Default
  @Column(name = "IS_PROXY_CLAIM", nullable = false)
  private Boolean isProxyClaim = false; // 대리청구 가능 여부

  @Builder.Default
  @Column(name = "IS_TRUST_VIEW", nullable = false)
  private Boolean isTrustView = false; // 신탁 조회 권한 여부
}
