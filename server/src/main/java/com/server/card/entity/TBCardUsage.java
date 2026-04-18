package com.server.card.entity;

import com.server.common.entity.BaseCreatedEntity;
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
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "TB_CARD_USAGE")
public class TBCardUsage extends BaseCreatedEntity {

  @Id
  @Tsid
  @Column(name = "CARD_USAGE_ID", columnDefinition = "bigint unsigned")
  private Long cardUsageId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CARD_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_CardUsage_cardId_Card"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  private TBCard card;

  @Column(name = "USAGE_NM", nullable = false, length = 100)
  private String usageNm;

  @Column(name = "USAGE_LOC", length = 255)
  private String usageLoc;

  @Enumerated(EnumType.STRING)
  @Column(name = "USAGE_TYPE_CD", nullable = false)
  private UsageType usageTypeCd;

  @Column(name = "USAGE_AMT", nullable = false, precision = 18, scale = 2)
  private java.math.BigDecimal usageAmt;

  @Column(name = "ABNML_YN", nullable = false, length = 1)
  @Builder.Default
  private String abnmlYn = "N";

  @Column(name = "APRVL_YN", nullable = false, length = 1)
  @Builder.Default
  private String aprvlYn = "Y";

  public enum UsageType {
    SPEND, CHARGE
  }
}
