package com.server.asset.dto.admin;

import java.math.BigDecimal;

import com.server.asset.entity.TBRealAsset;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRealAssetResponse {

	private String realAssetId;
	private String assetNm;
	private String addr;
	private BigDecimal evalAmt;
	private BigDecimal assetSize;
	private String assetDesc;

	public static AdminRealAssetResponse from(TBRealAsset asset) {
		return AdminRealAssetResponse.builder()
			.realAssetId(String.valueOf(asset.getRealAssetId()))
			.assetNm(asset.getAssetNm())
			.addr(asset.getAddr())
			.evalAmt(asset.getEvalAmt())
			.assetSize(asset.getAssetSize())
			.assetDesc(asset.getAssetDesc())
			.build();
	}
}
