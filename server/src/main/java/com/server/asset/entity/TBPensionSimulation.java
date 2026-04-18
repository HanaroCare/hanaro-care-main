package com.server.asset.entity;

import com.server.asset.entity.enums.PensionPayoutType;
import com.server.common.entity.BaseEntity;
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
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "TB_PENSION_SIMULATION",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_TbPensionSimulation_realAssetId",
            columnNames = {"REAL_ASSET_ID"}
        )
    })
public class TBPensionSimulation extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "PENSION_SIMULATION_ID", columnDefinition = "bigint unsigned")
  private Long pensionSimulationId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "REAL_ASSET_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_TbPensionSimulation_realAssetId_TbRealAsset"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  private TBRealAsset realAsset;

  @Enumerated(EnumType.STRING)
  @Column(name = "RECOMMENDED_TYPE", nullable = false)
  private PensionPayoutType recommendedType;

  @Column(name = "RECOMMENDED_MONTHLY_AMT", precision = 13, scale = 2, nullable = false)
  private BigDecimal recommendedMonthlyAmt;

  @Column(name = "RECOMMENDED_CUMULATIVE_AMT", precision = 13, scale = 2, nullable = false)
  private BigDecimal recommendedCumulativeAmt;

  /**
   * 계산 시점의 집값 스냅샷 — 집값이 변경되면 재계산 트리거
   */
  @Column(name = "EVAL_AMT_SNAPSHOT", precision = 13, scale = 2, nullable = false)
  private BigDecimal evalAmtSnapshot;

  /**
   * 3가지 방식 전체 비교 데이터 JSON — 상세 페이지 재계산 없이 반환
   */
  @Column(name = "PLANS_JSON", columnDefinition = "JSON")
  private String plansJson;
}
