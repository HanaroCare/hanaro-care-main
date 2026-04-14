package com.server.asset.dto.pension;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "주택 집값 예측 응답")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PensionForecastResponse {

	@Schema(description = "부동산 자산 ID", example = "1")
	private Long realAssetId;

	@Schema(description = "자산명", example = "대치동 OO아파트")
	private String assetNm;

	@Schema(description = "현재 평가금액 (원)", example = "800000000")
	private BigDecimal currentPrice;

	@Schema(description = "예측 기간 (년)", example = "5", allowableValues = {"5", "10", "20"})
	private Integer periodYears;

	@Schema(description = "확률 가중 기댓값 — 각 시나리오의 예상 금액 × 확률의 합 (원)", example = "893629000")
	private BigDecimal expectedPrice;

	@Schema(description = "과거 시세 추이 (최근 7년) — 차트 회색선 데이터")
	private List<PensionHistoricalPriceDto> historicalPrices;

	@Schema(description = "시나리오별 예측 결과 (낙관 / 중립 / 비관)")
	private List<PensionForecastScenarioDto> scenarios;

	@Schema(description = "연도별 예측 차트 데이터 — X축은 실제 연도")
	private List<PensionForecastChartPointDto> chartPoints;

	@Schema(description = "AI 추천 시나리오 타입", example = "BASE", allowableValues = {"UP", "BASE", "DOWN"})
	private String recommendedScenario;

	@Schema(description = "AI 추천 제목", example = "중립 시나리오 추천")
	private String recommendedTitle;

	@Schema(description = "AI 추천 설명 (지역 특성 및 시장 상황 반영)", example = "대치동은 학군 수요 기반의 안정적인 시세를 유지해왔으나 금리 부담으로 단기 상승은 제한적입니다.")
	private String recommendedDescription;

	@Schema(description = "예측에 사용된 AI 모델", example = "gemini-2.0-flash")
	private String modelVersion;

	@Schema(description = "예측 수행 시각", example = "2026-04-14T21:00:00")
	private LocalDateTime predictedAt;
}
