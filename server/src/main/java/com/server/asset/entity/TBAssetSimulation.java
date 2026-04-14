package com.server.asset.entity;

import java.math.BigDecimal;

import com.server.asset.entity.enums.CareType;
import com.server.common.entity.BaseCreatedEntity;
import com.server.user.entity.TBUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
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
@Table(name = "TB_ASSET_SIMULATION",
    indexes = {
        @Index(name = "idx_simulation_user_created", columnList = "USER_ID, CREATED_AT DESC")
    })
public class TBAssetSimulation extends BaseCreatedEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "SIMULATION_ID", columnDefinition = "bigint unsigned")
  private Long simulationId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_TbAssetSimulation_userId_TbUser"))
  private TBUser user;

  @Column(name = "TARGET_AGE", nullable = false)
  private Integer targetAge;

  @Enumerated(EnumType.STRING)
  @Column(name = "CARE_TYPE_CD", nullable = false)
  private CareType careType;

  // [AI 분석 결과 요약]
  @Column(name = "TOTAL_INCOME_AMT", nullable = false, precision = 13, scale = 2)
  private BigDecimal totalIncomeAmt;

  @Column(name = "SHORTAGE_AMT", nullable = false, precision = 13, scale = 2)
  private BigDecimal shortageAmt;

  @Column(name = "IS_SUFFICIENT", nullable = false)
  private Boolean isSufficient;

  @Column(name = "LIVING_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal livingCost;

  @Column(name = "MEDICAL_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal medicalCost;

  @Column(name = "CARE_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal careCost;

  @Column(name = "MONTHLY_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal monthlyCost;

  // [AI 상세 리포트 JSON]
  @Column(name = "AGE_RANGE_DETAILS", nullable = false, columnDefinition = "JSON")
  private String ageRangeDetails;

}
