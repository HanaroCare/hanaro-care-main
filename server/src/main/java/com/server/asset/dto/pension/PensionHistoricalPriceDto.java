package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Schema(description = "과거 연도별 시세 데이터 (차트 회색선)")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionHistoricalPriceDto {

	@Schema(description = "실제 연도", example = "2020")
	private Integer year;

	@Schema(description = "해당 연도 추정 시세 (원)", example = "580000000")
	private BigDecimal price;
}
