package com.server.asset.entity;

import com.server.asset.entity.enums.AssetCategory;
import com.server.common.converter.AccountNumConverter;
import com.server.common.entity.BaseEntity;
import com.server.user.entity.TBUser;
import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
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
@Table(name = "TB_ACCOUNT")
public class TBAccount extends BaseEntity {

  @Id
  @Tsid
  @Column(name = "ACCOUNT_ID", columnDefinition = "bigint unsigned")
  private Long accountId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_Account_userId_User"))
  private TBUser user;

  @Column(name = "INST_NM", nullable = false, length = 50)
  private String instNm;

  @Column(name = "ACCOUNT_NM", nullable = false, length = 50)
  private String accountNm;

  @Convert(converter = AccountNumConverter.class)
  @Column(name = "ACCOUNT_NUM", nullable = false, length = 100)
  private String accountNum;

  @Column(name = "BALANCE_AMT", nullable = false, precision = 13, scale = 2)
  @Builder.Default
  private BigDecimal balanceAmt = BigDecimal.ZERO;

  @Enumerated(EnumType.STRING)
  @Column(name = "ASSET_CATE_CD", nullable = false)
  private AssetCategory assetCateCd;

  @Column(name = "PROFIT_RATE", precision = 5, scale = 2)
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

  // @Builder.Default: 빌더 사용 시 기본값 true
  // @PrePersist: 기본 생성자로 만들어진 인스턴스도 null 방지
  @Builder.Default
  @Column(name = "IS_LINKED", nullable = false)
  private Boolean isLinked = true;

  /**
   * JPA persist 직전 isLinked가 null이면 true로 초기화한다.
   * Lombok @Builder.Default는 Builder 경로에서만 동작하므로
   * new TBAccount() 경로의 null을 방어한다.
   */
  @PrePersist
  protected void prePersist() {
    if (this.isLinked == null) {
      this.isLinked = true;
    }
  }
}