package com.server.asset.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.server.asset.entity.enums.TransStat;
import com.server.asset.entity.enums.TransType;
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
@Table(name = "TB_ASSET_TRANS")
public class TBAssetTrans extends BaseEntity {

	@Id
	@Tsid
	@Column(name = "TRANS_ID", columnDefinition = "bigint unsigned")
	private Long transId;

	@Enumerated(EnumType.STRING)
	@Column(name = "TRANS_TYPE_CD", nullable = false)
	private TransType transType;

	@Column(name = "TRANS_AMT",
		precision = 18, scale = 2,
		nullable = false,
		columnDefinition = "DECIMAL(18,2) DEFAULT 0")
	private BigDecimal transAmt;

	@Enumerated(EnumType.STRING)
	@Column(name = "TRANS_STAT_CD", nullable = false)
	private TransStat transStat;

	@Column(name = "TRANS_DT",
		nullable = false,
		columnDefinition = "DATETIME DEFAULT NOW()")
	private LocalDateTime transDt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_PRODUT_ID", referencedColumnName = "USER_PROD_ID",
		columnDefinition = "bigint unsigned not null",
		foreignKey = @ForeignKey(name = "fk_AssetTrans_userProdutId_UserProd"))
	private TBUserProd userProd;
}
