package com.server.card.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "TB_CARD")
public class TBCard extends BaseEntity {

  @Id
  @Tsid
  @JsonFormat(shape = JsonFormat.Shape.STRING) // TSID: JS Number.MAX_SAFE_INTEGER 초과 방지
  @Column(name = "CARD_ID", columnDefinition = "bigint unsigned")
  private Long cardId;

  @Column(name = "CARD_NM", nullable = false, length = 50)
  private String cardNm;

  @Column(name = "AUTO_TRANS_AMT", nullable = false, precision = 13, scale = 2)
  @Builder.Default
  private BigDecimal autoTransAmt = BigDecimal.ZERO;

  @Builder.Default
  @Column(name = "IS_USE", nullable = false)
  private Boolean isUse = true;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ACCOUNT_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_Card_accountId_Account"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  private TBAccount account;

  @Column(name = "LIMIT_AMT", nullable = false, precision = 13, scale = 2)
  @Builder.Default
  private BigDecimal limitAmt = BigDecimal.ZERO;

  @Column(name = "BALANCE_AMT", nullable = false, precision = 18, scale = 2)
  @Builder.Default
  private BigDecimal balanceAmt = BigDecimal.ZERO;

  @Column(name = "PAY_DAY", nullable = false)
  @Builder.Default
  private Integer payDay = 1;
}
