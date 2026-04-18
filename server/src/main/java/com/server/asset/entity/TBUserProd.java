package com.server.asset.entity;

import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.PensionPayoutType;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.entity.enums.StartType;
import com.server.common.entity.BaseEntity;
import com.server.user.entity.TBUser;
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
import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "TB_USER_PROD")
public class TBUserProd extends BaseEntity {

  @Id
  @Tsid
  @Column(name = "USER_PROD_ID", columnDefinition = "bigint unsigned")
  private Long userProdId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_UserProd_userId_User"))
  private TBUser user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "PRODUCT_ID", referencedColumnName = "PRODUCT_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_UserProd_prodId_Product"))
  private TBProduct product;

  @Enumerated(EnumType.STRING)
  @Column(name = "PROD_TYPE_CD", nullable = false)
  private ProdType prodType;

  @Enumerated(EnumType.STRING)
  @Column(name = "PAYOUT_TYPE_CD", nullable = false)
  private PayoutType payoutType;

  @Enumerated(EnumType.STRING)
  @Column(name = "PROD_STAT_CD", nullable = false)
  private ProdStat prodStat;

  @Enumerated(EnumType.STRING)
  @Column(name = "PENSION_PAYOUT_TYPE_CD")
  private PensionPayoutType pensionPayoutType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TARGET_ASSET_ID", referencedColumnName = "REAL_ASSET_ID",
      columnDefinition = "bigint unsigned",
      foreignKey = @ForeignKey(name = "fk_UserProd_targetAssetId_RealAsset"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  private TBRealAsset targetAsset;

  @Column(name = "MONTHLY_PAYOUT",
      precision = 13, scale = 2)
  private BigDecimal monthlyPayout;

  @Enumerated(EnumType.STRING)
  @Column(name = "INVEST_TYPE_CD")
  private InvestType investType;

  @Column(name = "PRINCIPAL_AMOUNT",
      precision = 13, scale = 2)
  private BigDecimal principalAmount;

  @Column(name = "PROFIT_RATE",
      precision = 5, scale = 2,
      nullable = true)
  private BigDecimal profitRate;

  @Column(name = "PROFIT",
      precision = 13, scale = 2,
      nullable = true)
  private BigDecimal profit;

  @Enumerated(EnumType.STRING)
  @Column(name = "START_TYPE", nullable = true)
  private StartType startType;

  @Column(name = "START_DATE", nullable = true)
  private LocalDate startDate;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CLAIM_AGENT_ID", referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned",
      nullable = true,
      foreignKey = @ForeignKey(name = "fk_UserProd_claimAgentId_User"))
  private TBUser claimAgent;

  @Builder.Default
  @Column(name = "IS_AGENT_VIEW", nullable = false)
  private Boolean isAgentView = false;

  @Column(name = "PAYOUT_SETTINGS", columnDefinition = "JSON")
  private String payoutSettings;

  @Column(name = "LAST_PAYOUT_DATE", nullable = true)
  private LocalDate lastPayoutDate;
}
