package com.server.inheritance.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.server.common.entity.BaseEntity;
import com.server.inheritance.enums.FamilyRelation;
import com.server.user.entity.TBUser;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "TB_INHERIT_DETAIL")
public class TBInheritDetail extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "INHERIT_DETAIL_ID",
      columnDefinition = "bigint unsigned")
  private Long inheritDetailId;

  @Column(name = "RELATION_CD", nullable = false)
  @Enumerated(EnumType.STRING)
  private FamilyRelation relationCd;

  @Column(name = "DIST_RATIO", nullable = false, precision = 15, scale = 2)
  private BigDecimal distRatio;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "INHERIT_PLAN_ID", referencedColumnName = "INHERIT_PLAN_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_InheritDetail_inheritPlanId_InheritPlan"
      ))
  private TBInheritPlan inheritPlan;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_InheritDetail_userId_User"
      ))
  private TBUser user;

  @JsonManagedReference
  @OneToOne(mappedBy = "inheritDetail", cascade = CascadeType.ALL, orphanRemoval = true)
  private TBInheritLetter inheritLetter;
}
