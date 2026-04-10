package com.server.asset.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.server.asset.entity.enums.AssetCategory;
import com.server.common.entity.BaseEntity;

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
@Table(name = "TB_ACCOUNT")
public class TbAccount extends BaseEntity {

	@Id
	@Tsid
	@Column(name = "ACCOUNT_ID", columnDefinition = "bigint unsigned")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID",
		columnDefinition = "bigint unsigned not null",
		foreignKey = @ForeignKey(name = "fk_Account_userId_User"))
	private TbUser user;

	@Column(name = "INST_NM", nullable = false, length = 50)
	private String instNm;

	@Column(name = "ACCOUNT_NM", nullable = false, length = 50)
	private String accountNm;

	@Column(name = "ACCOUNT_NUM", nullable = false, length = 50)
	private String accountNum;

	@Column(name = "BALANCE_AMT", nullable = false, precision = 13, scale = 2)
	@Builder.Default
	private BigDecimal balanceAmt = BigDecimal.ZERO;

	@Enumerated(EnumType.STRING)
	@Column(name = "ASSET_CATE_CD", nullable = false)
	private AssetCategory assetCateCd;

	@Column(name = "PROFIT_RATE", precision = 4, scale = 2)
	private BigDecimal profitRate;

	@Column(name = "LIMIT_AMT", precision = 13, scale = 2)
	private BigDecimal limitAmt;

	@Column(name = "PAY_DAY")
	private Integer payDay;

	@Column(name = "PAY_AMT", precision = 13, scale = 2)
	private BigDecimal payAmt;

	@Column(name = "CONTR_DT")
	private LocalDate contrDt;

	@Column(name = "EXPIRE_DT")
	private LocalDate expireDt;

	@Column(name = "MONTHLY_PREM_AMT", precision = 13, scale = 2)
	private BigDecimal monthlyPremAmt;
}
