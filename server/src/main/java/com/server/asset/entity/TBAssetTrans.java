package com.server.asset.entity;

import com.server.asset.entity.enums.TransStatCd;
import com.server.asset.entity.enums.TransTypeCd;
import com.server.common.entity.BaseEntity;

import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
	private TransTypeCd transTypeCd;

	@Column(name = "TRANS_AMT",
		precision = 18, scale = 2,
		nullable = false,
		columnDefinition = "DECIMAL(18,2) DEFAULT 0")
	private BigDecimal transAmt;

	@Enumerated(EnumType.STRING)
	@Column(name = "TRANS_STAT_CD", nullable = false)
	private TransStatCd transStatCd;

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
