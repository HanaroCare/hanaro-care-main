package com.server.asset.dto.link;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class RealAssetRequest {

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class HousingLinkRequest {
		@Schema(description = "주소", example = "서울시 강남구 역삼동 하나아파트 101동")
		private String addr;

		@Schema(description = "주택종류 (APARTMENT, VILLA 등)", example = "APARTMENT")
		@JsonProperty("housing_type")
		private String housingType;

		@Schema(description = "면적 (㎡)", example = "84.5")
		@JsonProperty("asset_size")
		private Double assetSize;

		@Schema(description = "취득연도", example = "2021")
		@JsonProperty("acquisition_year")
		private Integer acquisitionYear;

		@Schema(description = "기존 대출 여부", example = "true")
		@JsonProperty("has_loan")
		private Boolean hasLoan;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class VehicleLinkRequest {
		@Schema(description = "차량 번호", example = "12가1234")
		@JsonProperty("car_number")
		private String carNumber;
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class GoldLinkRequest {
		@Schema(description = "중량 (g)", example = "100.0")
		@JsonProperty("asset_size")
		private Double assetSize;

		@Schema(description = "금 함량 (24K, 18K 등)", example = "24K")
		private String purity;
	}
}
