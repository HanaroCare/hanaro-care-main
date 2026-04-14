package com.server.asset.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.StartType;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "TB_TRUST_SIMULATION",
	uniqueConstraints = {
		@UniqueConstraint(
			name = "unique_TbTrustSimulation_userId",
			columnNames = {"USER_ID"}
		)
	})
public class TBTrustSimulation extends BaseCreatedEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "TRUST_SIMULATION_ID", columnDefinition = "bigint unsigned")
	private Long trustSimulationId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID",
		columnDefinition = "bigint unsigned not null",
		foreignKey = @ForeignKey(name = "fk_TbTrustSimulation_userId_TbUser"))
	private TBUser user;

	@Column(name = "PRINCIPAL_AMOUNT",
		precision = 13, scale = 2,
		nullable = true)
	private BigDecimal principalAmount;

	@Enumerated(EnumType.STRING)
	@Column(name = "START_TYPE", nullable = false)
	private StartType startType;

	@Column(name = "START_DATE")
	private LocalDateTime startDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "INVEST_TYPE", nullable = false)
	private InvestType investType;

	@Enumerated(EnumType.STRING)
	@Column(name = "PAYOUT_TYPE", nullable = false)
	private PayoutType payoutType;

	@Column(name = "PAYOUT_SETTINGS", columnDefinition = "JSON")
	private String payoutSettings;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CLAIM_AGENT_ID", referencedColumnName = "USER_ID",
		columnDefinition = "bigint unsigned",
		nullable = true,
		foreignKey = @ForeignKey(name = "fk_TrustSimulation_claimAgentId_User"))
	private TBUser claimAgent;
}
