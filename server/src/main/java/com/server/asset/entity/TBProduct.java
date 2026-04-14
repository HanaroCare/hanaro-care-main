package com.server.asset.entity;

import com.server.asset.entity.enums.ProdCate;
import com.server.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "TB_PRODUCT")
public class TBProduct extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "PRODUCT_ID", columnDefinition = "int unsigned")
	private Integer productId;

	@Enumerated(EnumType.STRING)
	@Column(name = "PROD_CATE_CD", nullable = false)
	private ProdCate prodCate;

	@Column(name = "PROD_NM", nullable = false, length = 10)
	private String prodNm;

	@Column(name = "PROD_DESC", nullable = false, length = 30)
	private String prodDesc;

}
