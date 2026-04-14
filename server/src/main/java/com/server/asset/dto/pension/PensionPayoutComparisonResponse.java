package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Schema(description = "주택연금 수령 방식 비교 응답")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionPayoutComparisonResponse {

	@Schema(description = "추천 수령 방식 타입", example = "FIXED", allowableValues = {"FIXED", "FRONT_LOADED", "GROWING"})
	private String recommendedType;

	@Schema(description = "추천 수령 방식 한글명", example = "정액형")
	private String recommendedLabel;

	@Schema(description = "추천 방식 설명", example = "고정된 금액을 평생 수령하는 방식이에요")
	private String recommendedDescription;

	@Schema(description = "3가지 수령 방식별 데이터 (정액형 / 초기증액형 / 정기증가형)")
	private List<PensionPayoutPlanDto> plans;
}
