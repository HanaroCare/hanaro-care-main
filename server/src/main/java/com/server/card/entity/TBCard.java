package com.server.card.entity;

import java.math.BigDecimal;

import com.server.asset.entity.TBAccount;
import com.server.common.entity.BaseEntity;

import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "TB_CARD")
public class TBCard extends BaseEntity {
	@Id
	@Tsid
	@Column(name = "CARD_ID", columnDefinition = "bigint unsigned")
	private Long cardId;

	@Column(name = "CARD_NM", nullable = false, length = 255)
	private String cardNm;

	@Column(name = "AUTO_TRANS_AMT", nullable = false, precision = 18, scale = 2)
	@Builder.Default
	private BigDecimal autoTransAmt = BigDecimal.ZERO;

	@Column(name = "USE_YN", nullable = false, length = 1)
	@Builder.Default
	private String useYn = "Y";

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ACCOUNT_ID",
		columnDefinition = "bigint unsigned not null",
		foreignKey = @ForeignKey(name = "fk_Card_accountId_Account"))
	private TBAccount account;

	@Column(name = "LIMIT_AMT", nullable = false, precision = 18, scale = 2)
	@Builder.Default
	private BigDecimal limitAmt = BigDecimal.ZERO;

}
