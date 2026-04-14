package com.server.asset.controller;

import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.dto.pension.PensionPayoutComparisonResponse;
import com.server.asset.dto.pension.PensionSimulationSummaryResponse;
import com.server.asset.service.pension.PensionForecastService;
import com.server.asset.service.pension.PensionPayoutService;
import com.server.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asset/pension")
@RequiredArgsConstructor
@Tag(name = "주택연금 API", description = "주택연금 설계 및 현황과 관련된 API입니다.")
public class PensionController {

	private final PensionForecastService pensionForecastService;
	private final PensionPayoutService pensionPayoutService;

	@GetMapping("/{realAssetId}/forecast")
	@Operation(
		summary = "주택 집값 AI 예측",
		description = """
			보유 주택의 주소와 현재 평가금액을 기반으로 Gemini AI가 집값을 예측합니다.

			- 시나리오 연율은 고정값 (낙관 +4%/년, 중립 +2%/년, 비관 0%/년)
			- 각 시나리오의 발생 확률은 Gemini가 지역 시장 상황을 분석해 결정
			- expectedPrice: 세 시나리오를 확률로 가중 평균한 기댓값 (가장 가능성 높은 집값)
			- historicalPrices: 최근 7년 시세 추이 (차트 회색선용)
			- chartPoints: 예측 기간 동안 연도별 3개 시나리오 집값 (차트 예측선용)
			"""
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "예측 성공",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": "COMMON200",
				  "message": "성공입니다.",
				  "result": {
				    "realAssetId": 1,
				    "assetNm": "대치동 OO아파트",
				    "currentPrice": 800000000,
				    "periodYears": 5,
				    "expectedPrice": 893629000,
				    "historicalPrices": [
				      { "year": 2020, "price": 580000000 },
				      { "year": 2021, "price": 660000000 },
				      { "year": 2022, "price": 750000000 },
				      { "year": 2023, "price": 720000000 },
				      { "year": 2024, "price": 740000000 },
				      { "year": 2025, "price": 775000000 },
				      { "year": 2026, "price": 800000000 }
				    ],
				    "scenarios": [
				      {
				        "scenarioType": "UP",
				        "scenarioLabel": "낙관",
				        "annualRate": 0.04,
				        "totalGrowthRate": 21.67,
				        "predictedPrice": 973322000,
				        "probability": 0.30
				      },
				      {
				        "scenarioType": "BASE",
				        "scenarioLabel": "중립",
				        "annualRate": 0.02,
				        "totalGrowthRate": 10.41,
				        "predictedPrice": 883265000,
				        "probability": 0.50
				      },
				      {
				        "scenarioType": "DOWN",
				        "scenarioLabel": "비관",
				        "annualRate": 0.00,
				        "totalGrowthRate": 0.00,
				        "predictedPrice": 800000000,
				        "probability": 0.20
				      }
				    ],
				    "chartPoints": [
				      { "year": 2027, "upPrice": 832000000, "basePrice": 816000000, "downPrice": 800000000 },
				      { "year": 2028, "upPrice": 865280000, "basePrice": 832320000, "downPrice": 800000000 },
				      { "year": 2029, "upPrice": 899891000, "basePrice": 848966000, "downPrice": 800000000 },
				      { "year": 2030, "upPrice": 935887000, "basePrice": 865946000, "downPrice": 800000000 },
				      { "year": 2031, "upPrice": 973322000, "basePrice": 883265000, "downPrice": 800000000 }
				    ],
				    "recommendedScenario": "BASE",
				    "recommendedTitle": "중립 시나리오 추천",
				    "recommendedDescription": "대치동은 학군 수요 기반의 안정적인 시세를 유지해왔으나 금리 부담으로 단기 상승은 제한적입니다. 중립 시나리오가 가장 현실적인 기준입니다.",
				    "modelVersion": "gemini-2.0-flash",
				    "predictedAt": "2026-04-14T21:00:00"
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "잘못된 요청",
			content = @Content(examples = {
				@ExampleObject(name = "유효하지 않은 기간", value = """
					{
					  "isSuccess": false,
					  "code": "COMMON400",
					  "message": "조회 기간은 5년, 10년, 20년만 가능합니다.",
					  "result": null
					}
					"""),
				@ExampleObject(name = "부동산 외 자산", value = """
					{
					  "isSuccess": false,
					  "code": "COMMON400",
					  "message": "부동산 자산만 예측할 수 있습니다.",
					  "result": null
					}
					""")
			})
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "자산 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON400",
				  "message": "해당 주택 자산이 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<PensionForecastResponse>> getForecast(
		@PathVariable Long realAssetId,
		@RequestParam(defaultValue = "5") Integer periodYears
	) {
		PensionForecastResponse response = pensionForecastService.getForecast(realAssetId, periodYears);
		return ResponseEntity.ok(ApiResponse.onSuccess(response));
	}

	@GetMapping("/{realAssetId}/payout-comparison")
	@Operation(
		summary = "주택연금 설계 결과 상세 조회",
		description = """
			집값 예측에 사용된 주택을 기반으로 3가지 주택연금 수령 방식을 비교합니다.

			수령 방식:
			- 정액형 (FIXED): 매달 동일한 금액 수령
			- 초기증액형 (FRONT_LOADED): 1~10년은 20% 증액, 이후 27% 감액
			- 정기증가형 (GROWING): 기본의 70%로 시작해 매년 3.5%씩 증가

			추천 기준: 20년 누적 수령액이 가장 많은 방식을 추천

			월 수령액 기준: 집값 × 0.38% (예: 8억 → 약 304만원/월)
			"""
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "비교 성공",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": "COMMON200",
				  "message": "성공입니다.",
				  "result": {
				    "recommendedType": "FIXED",
				    "recommendedLabel": "정액형",
				    "recommendedDescription": "고정된 금액을 평생 수령하는 방식이에요",
				    "plans": [
				      {
				        "type": "FIXED",
				        "label": "정액형",
				        "description": "고정된 금액을 평생 수령하는 방식이에요",
				        "totalCumulativeAmount": 729600000,
				        "yearlyData": [
				          { "year": 1,  "monthlyAmount": 3040000, "cumulativeAmount": 36480000 },
				          { "year": 2,  "monthlyAmount": 3040000, "cumulativeAmount": 72960000 },
				          { "year": 10, "monthlyAmount": 3040000, "cumulativeAmount": 364800000 },
				          { "year": 20, "monthlyAmount": 3040000, "cumulativeAmount": 729600000 }
				        ]
				      },
				      {
				        "type": "FRONT_LOADED",
				        "label": "초기증액형",
				        "description": "초기 10년은 더 많이 받고 이후 줄어드는 방식이에요",
				        "totalCumulativeAmount": 700224000,
				        "yearlyData": [
				          { "year": 1,  "monthlyAmount": 3648000, "cumulativeAmount": 43776000 },
				          { "year": 10, "monthlyAmount": 3648000, "cumulativeAmount": 437760000 },
				          { "year": 11, "monthlyAmount": 2219000, "cumulativeAmount": 464388000 },
				          { "year": 20, "monthlyAmount": 2219000, "cumulativeAmount": 700224000 }
				        ]
				      },
				      {
				        "type": "GROWING",
				        "label": "정기증가형",
				        "description": "처음엔 적지만 매년 3.5%씩 늘어나는 방식이에요",
				        "totalCumulativeAmount": 698112000,
				        "yearlyData": [
				          { "year": 1,  "monthlyAmount": 2128000, "cumulativeAmount": 25536000 },
				          { "year": 10, "monthlyAmount": 2993000, "cumulativeAmount": 304560000 },
				          { "year": 20, "monthlyAmount": 4236000, "cumulativeAmount": 698112000 }
				        ]
				      }
				    ]
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "평가금액 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON400",
				  "message": "현재 평가금액이 없어 연금을 계산할 수 없습니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "자산 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON400",
				  "message": "해당 주택 자산이 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<PensionPayoutComparisonResponse>> getPayoutComparison(
		@PathVariable Long realAssetId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionPayoutService.compare(realAssetId)));
	}

	@GetMapping("/{realAssetId}/payout-summary")
	@Operation(
		summary = "주택연금 설계 요약 조회",
		description = "메인/자산 화면의 주택연금 요약 카드용 빠른 조회 API입니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "조회 성공",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": "COMMON200",
				  "message": "성공입니다.",
				  "result": {
				    "recommendedType": "FIXED",
				    "recommendedLabel": "정액형",
				    "recommendedMonthlyAmount": 3040000,
				    "recommendedCumulativeAmount": 729600000
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "시뮬레이션 미생성",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON400",
				  "message": "저장된 주택연금 시뮬레이션이 없습니다. 먼저 비교 조회를 실행해 주세요.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<PensionSimulationSummaryResponse>> getPayoutSummary(
		@PathVariable Long realAssetId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionPayoutService.getSummary(realAssetId)));
	}
}
