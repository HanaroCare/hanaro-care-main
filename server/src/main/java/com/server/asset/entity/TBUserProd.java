package com.server.asset.entity;

import java.math.BigDecimal;

import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.PayoutType;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "TARGET_ASSET_ID", referencedColumnName = "REAL_ASSET_ID",
		columnDefinition = "bigint unsigned",
		nullable = true,
		foreignKey = @ForeignKey(name = "fk_UserProd_targetAssetId_RealAsset"))
	private TBRealAsset targetAsset;

	@Column(name = "EXPECTED_MONTHLY_PAYOUT",
		precision = 13, scale = 2,
		nullable = true)
	private BigDecimal expectedMonthlyPayout;

	@Column(name = "EXPECTED_PERIOD", nullable = true)
	private Byte expectedPeriod;

	@Enumerated(EnumType.STRING)
	@Column(name = "INVEST_TYPE_CD", nullable = true)
	private InvestType investType;

	@Column(name = "PRINCIPAL_AMOUNT",
		precision = 13, scale = 2,
		nullable = true)
	private BigDecimal principalAmount;

	@Column(name = "EXPECTED_RATE",
		precision = 5, scale = 2,
		nullable = true)
	private BigDecimal expectedRate;

	@Column(name = "EXPECTED_PROFIT",
		precision = 13, scale = 2,
		nullable = true)
	private BigDecimal expectedProfit;

	@Enumerated(EnumType.STRING)
	@Column(name = "START_TYPE", nullable = true)
	private StartType startType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CLAIM_AGENT_ID", referencedColumnName = "USER_ID",
		columnDefinition = "bigint unsigned",
		nullable = true,
		foreignKey = @ForeignKey(name = "fk_UserProd_claimAgentId_User"))
	private TBUser claimAgent;

	@Column(name = "AGENT_VIEW_YN", length = 1)
	private String agentViewYn;
}
