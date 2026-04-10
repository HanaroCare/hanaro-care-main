package com.server.asset.entity;

import com.server.common.entity.BaseCreatedEntity;
import com.server.user.entity.TBUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
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
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_TbAssetSimulation_userId",
            columnNames = {"USER_ID"}
        )
    })
public class TBAssetSimulation extends BaseCreatedEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(columnDefinition = "bigint unsigned")
  private Long simulationId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_TbAssetSimulation_userId_TbUser"))
  private TBUser user;

  @Column(name = "TARGET_AGE", nullable = false)
  private Integer targetAge;

  @Column(name = "LIVING_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal livingCost;

  @Column(name = "MEDICAL_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal medicalCost;

  @Column(name = "CARE_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal careCost;

  @Column(name = "MONTHLY_COST", nullable = false, precision = 13, scale = 2)
  private BigDecimal monthlyCost;

  @Column(name = "AGE_RANGE_DETAILS", nullable = false, columnDefinition = "JSON")
  private String ageRangeDetails;

}
