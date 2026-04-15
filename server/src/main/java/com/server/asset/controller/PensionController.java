package com.server.asset.controller;

import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.dto.pension.PensionPayoutComparisonResponse;
import com.server.asset.dto.pension.PensionPayoutHistoryResponse;
import com.server.asset.dto.pension.PensionSimulationSummaryResponse;
import com.server.asset.dto.pension.PensionStatusResponse;
import com.server.asset.service.pension.PensionForecastService;
import com.server.asset.service.pension.PensionPayoutService;
import com.server.asset.service.pension.PensionStatusService;
import com.server.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asset/pension")
@RequiredArgsConstructor
@Tag(name = "주택연금 API", description = "주택연금 설계 및 현황과 관련된 API입니다.")
public class PensionController {

	private final PensionForecastService pensionForecastService;
	private final PensionPayoutService pensionPayoutService;
	private final PensionStatusService pensionStatusService;

	@GetMapping("/status")
	@Operation(
		summary = "주택연금 운용 현황",
		description = """
			가입 중인 주택연금의 이달 수령액, 수령 방식, 누적 수령액 차트를 반환합니다.

			차트 범위: 현재 연차 ~ 현재 + 10년 (최대 20년차)
			차트 포인트 상태:
			- CURRENT: 현재 연차 (floor 스냅샷 기준)
			- FUTURE: 앞으로의 연차

			누적 수령액 계산:
			- floor 스냅샷 누적액 + 초과 개월 × 이달 수령액으로 보정
			"""
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
				    "pensionPayoutType": "FIXED",
				    "pensionPayoutLabel": "정액형",
				    "startDate": "2026-05-01",
				    "elapsedYear": 3,
				    "currentMonthlyPayout": 2050000,
				    "currentCumulativeAmount": 73800000,
				    "chartPoints": [
				      { "year": 4,  "monthlyAmount": 2050000, "cumulativeAmount": 98400000,  "status": "CURRENT" },
				      { "year": 7,  "monthlyAmount": 2050000, "cumulativeAmount": 172200000, "status": "FUTURE" },
				      { "year": 10, "monthlyAmount": 2050000, "cumulativeAmount": 246000000, "status": "FUTURE" },
				      { "year": 13, "monthlyAmount": 2050000, "cumulativeAmount": 319800000, "status": "FUTURE" }
				    ]
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "가입된 연금 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "PENSION_008",
				  "message": "가입된 주택연금 상품이 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<PensionStatusResponse>> getStatus(
		@AuthenticationPrincipal Long userId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionStatusService.getStatus(userId)));
	}

	@GetMapping("/payout-history")
	@Operation(
		summary = "주택연금 수령 내역",
		description = "가입 시작일부터 현재까지 월별 수령 내역을 최신순으로 반환합니다. DB 저장 없이 계산으로 생성합니다."
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
				    "totalReceivedAmount": 73800000,
				    "history": [
				      { "payoutDate": "2029-03-01", "amount": 2050000 },
				      { "payoutDate": "2029-02-01", "amount": 2050000 },
				      { "payoutDate": "2029-01-01", "amount": 2050000 }
				    ]
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "가입된 연금 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "PENSION_008",
				  "message": "가입된 주택연금 상품이 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<PensionPayoutHistoryResponse>> getPayoutHistory(
		@AuthenticationPrincipal Long userId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionStatusService.getPayoutHistory(userId)));
	}

	@GetMapping("/{realAssetId}/forecast")
	@Operation(
		summary = "주택 집값 AI 예측",
		description = """
			보유 주택의 주소와 현재 평가금액을 기반으로 Gemini AI가 집값을 예측합니다.

			시나리오 연율 (서버 고정값):
			- 낙관(UP): 연 +4%
			- 중립(BASE): 연 +2%
			- 비관(DOWN): 연 0%

			Gemini AI 역할:
			- 각 시나리오 발생 확률 결정 (지역 특성·국내 부동산 시황 반영)
			- 가장 가능성 높은 시나리오 추천 + 짧은 이유 1~2문장

			응답 구성:
			- scenarios: periodYears 기준 각 시나리오 예상 집값·확률·상승률
			- expectedPrice: 세 시나리오를 확률로 가중 평균한 기댓값
			- chartPoints: 2020년 ~ 현재+10년, 2년 단위, 3개 시나리오 동시 표시 (과거는 현재가 기준 역산)
			- recommendedReason: 추천 시나리오 이유 (학군·위치·교통·개발호재 등 반영)
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
				    "expectedPrice": 883265000,
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
				      { "year": 2020, "upPrice": 632000000, "basePrice": 710000000, "downPrice": 800000000 },
				      { "year": 2022, "upPrice": 684000000, "basePrice": 739000000, "downPrice": 800000000 },
				      { "year": 2024, "upPrice": 739000000, "basePrice": 769000000, "downPrice": 800000000 },
				      { "year": 2026, "upPrice": 800000000, "basePrice": 800000000, "downPrice": 800000000 },
				      { "year": 2028, "upPrice": 865280000, "basePrice": 832320000, "downPrice": 800000000 },
				      { "year": 2030, "upPrice": 935887000, "basePrice": 865944000, "downPrice": 800000000 },
				      { "year": 2032, "upPrice": 1012256000, "basePrice": 900928000, "downPrice": 800000000 },
				      { "year": 2034, "upPrice": 1094856000, "basePrice": 937328000, "downPrice": 800000000 },
				      { "year": 2036, "upPrice": 1184192000, "basePrice": 975192000, "downPrice": 800000000 }
				    ],
				    "recommendedScenario": "BASE",
				    "recommendedReason": "대치동은 학군 수요 기반의 안정적인 시세를 유지해왔으나 금리 부담으로 단기 상승은 제한적입니다.",
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
		@AuthenticationPrincipal Long userId,
		@PathVariable Long realAssetId,
		@RequestParam(defaultValue = "5") Integer periodYears
	) {
		PensionForecastResponse response = pensionForecastService.getForecast(userId, realAssetId, periodYears);
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
				    "plans": [
				      {
				        "type": "FIXED",
				        "label": "정액형",
				        "totalCumulativeAmount": 729600000,
				        "yearlyData": [
				          { "year": 1,  "monthlyAmount": 3040000, "cumulativeAmount": 36480000 },
				          { "year": 4,  "monthlyAmount": 3040000, "cumulativeAmount": 145920000 },
				          { "year": 7,  "monthlyAmount": 3040000, "cumulativeAmount": 255360000 },
				          { "year": 10, "monthlyAmount": 3040000, "cumulativeAmount": 364800000 },
				          { "year": 13, "monthlyAmount": 3040000, "cumulativeAmount": 474240000 },
				          { "year": 16, "monthlyAmount": 3040000, "cumulativeAmount": 583680000 },
				          { "year": 19, "monthlyAmount": 3040000, "cumulativeAmount": 693120000 },
				          { "year": 20, "monthlyAmount": 3040000, "cumulativeAmount": 729600000 }
				        ]
				      },
				      {
				        "type": "FRONT_LOADED",
				        "label": "초기증액형",
				        "totalCumulativeAmount": 700224000,
				        "yearlyData": [
				          { "year": 1,  "monthlyAmount": 3648000, "cumulativeAmount": 43776000 },
				          { "year": 4,  "monthlyAmount": 3648000, "cumulativeAmount": 175104000 },
				          { "year": 7,  "monthlyAmount": 3648000, "cumulativeAmount": 306432000 },
				          { "year": 10, "monthlyAmount": 3648000, "cumulativeAmount": 437760000 },
				          { "year": 13, "monthlyAmount": 2219000, "cumulativeAmount": 517524000 },
				          { "year": 16, "monthlyAmount": 2219000, "cumulativeAmount": 597288000 },
				          { "year": 19, "monthlyAmount": 2219000, "cumulativeAmount": 677052000 },
				          { "year": 20, "monthlyAmount": 2219000, "cumulativeAmount": 700224000 }
				        ]
				      },
				      {
				        "type": "GROWING",
				        "label": "정기증가형",
				        "totalCumulativeAmount": 698112000,
				        "yearlyData": [
				          { "year": 1,  "monthlyAmount": 2128000, "cumulativeAmount": 25536000 },
				          { "year": 4,  "monthlyAmount": 2352000, "cumulativeAmount": 110880000 },
				          { "year": 7,  "monthlyAmount": 2602000, "cumulativeAmount": 213072000 },
				          { "year": 10, "monthlyAmount": 2878000, "cumulativeAmount": 334800000 },
				          { "year": 13, "monthlyAmount": 3183000, "cumulativeAmount": 478524000 },
				          { "year": 16, "monthlyAmount": 3520000, "cumulativeAmount": 648240000 },
				          { "year": 19, "monthlyAmount": 3893000, "cumulativeAmount": 842136000 },
				          { "year": 20, "monthlyAmount": 4032000, "cumulativeAmount": 890520000 }
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
		@AuthenticationPrincipal Long userId,
		@PathVariable Long realAssetId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionPayoutService.compare(userId, realAssetId)));
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
		@AuthenticationPrincipal Long userId,
		@PathVariable Long realAssetId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionPayoutService.getSummary(userId, realAssetId)));
	}
}
