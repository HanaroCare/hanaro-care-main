package com.server.asset.entity;

import java.math.BigDecimal;

import com.server.asset.entity.enums.RealAssetCategory;
import com.server.common.entity.BaseEntity;
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
@Table(name = "TB_REAL_ASSET")
public class TBRealAsset extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "REAL_ASSET_ID", columnDefinition = "int unsigned")
  private Integer realAssetId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID",
      columnDefinition = "bigint unsigned not null",
      foreignKey = @ForeignKey(name = "fk_TbRealAsset_userId_TbUser"))
  private TBUser user;

  @Enumerated(EnumType.STRING)
  @Column(name = "ASSET_CATE_CD", nullable = false)
  private RealAssetCategory assetCateCd;

  @Column(name = "ASSET_NM", nullable = false, length = 30)
  private String assetNm;

  @Column(name = "EVAL_AMT", precision = 13, scale = 2)
  private BigDecimal evalAmt;

  @Column(name = "ADDR")
  private String addr;

  @Column(name = "ASSET_SIZE", precision = 6, scale = 2)
  private BigDecimal assetSize;

  @Column(name = "ASSET_DESC", columnDefinition = "TEXT")
  private String assetDesc;
}
