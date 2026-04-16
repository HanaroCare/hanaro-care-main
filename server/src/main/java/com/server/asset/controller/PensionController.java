package com.server.asset.controller;

import com.server.asset.dto.pension.*;
import com.server.asset.service.pension.PensionForecastService;
import com.server.asset.service.pension.PensionPayoutService;
import com.server.asset.service.pension.PensionStatusService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(name = "주택연금 API", description = "주택연금 설계, 예측 및 현황 관리를 위한 API 세트입니다.")
public class PensionController {

	private final PensionForecastService pensionForecastService;
	private final PensionPayoutService pensionPayoutService;
	private final PensionStatusService pensionStatusService;

	@GetMapping("/status")
	@Operation(
		summary = "주택연금 운용 현황 조회",
		description = "가입 중인 주택연금의 이달 수령액, 방식, 누적 수령액 및 향후 10년 예측 차트를 반환합니다."
	)
	public ResponseEntity<ApiResponse<PensionStatusResponse>> getStatus(
		@AuthenticationPrincipal SubscriberDTO loginUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionStatusService.getStatus(loginUser.getUserId())));
	}

	@GetMapping("/payout-history")
	@Operation(
		summary = "주택연금 월별 수령 내역",
		description = "가입일부터 현재까지의 전체 수령 내역을 최신순으로 조회합니다."
	)
	public ResponseEntity<ApiResponse<PensionPayoutHistoryResponse>> getPayoutHistory(
		@AuthenticationPrincipal SubscriberDTO loginUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionStatusService.getPayoutHistory(loginUser.getUserId())));
	}

	@GetMapping("/{realAssetId}/forecast")
	@Operation(
		summary = "AI 기반 주택 가격 예측",
		description = """
          Gemini AI를 활용하여 특정 부동산 자산의 향후 시나리오별 가격을 예측합니다.
          
          - **expectedPrice**: 각 시나리오 확률을 반영한 가중 평균값입니다.
          - **scenarios**: 낙관(4%), 중립(2%), 비관(0%) 시나리오별 결과입니다.
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
                 "expectedPrice": 893629100,
                 "scenarios": [
                   { "scenarioType": "UP", "scenarioLabel": "낙관", "annualRate": 0.04, "totalGrowthRate": 21.67, "predictedPrice": 973322000, "probability": 0.30 },
                   { "scenarioType": "BASE", "scenarioLabel": "중립", "annualRate": 0.02, "totalGrowthRate": 10.41, "predictedPrice": 883265000, "probability": 0.50 },
                   { "scenarioType": "DOWN", "scenarioLabel": "비관", "annualRate": 0.00, "totalGrowthRate": 0.00, "predictedPrice": 800000000, "probability": 0.20 }
                 ],
                 "recommendedScenario": "BASE",
                 "recommendedReason": "지역 학군 수요와 매수 심리를 고려할 때 완만한 상승세가 예상됩니다.",
                 "modelVersion": "gemini-2.0-flash",
                 "predictedAt": "2026-04-15T10:00:00"
               }
             }
             """))
		)
	})
	public ResponseEntity<ApiResponse<PensionForecastResponse>> getForecast(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@Parameter(description = "예측할 부동산 자산 ID") @PathVariable Long realAssetId,
		@Parameter(description = "예측 기간 (5, 10, 20년)") @RequestParam(defaultValue = "5") Integer periodYears
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionForecastService.getForecast(loginUser.getUserId(), realAssetId, periodYears)));
	}

	@GetMapping("/{realAssetId}/payout-comparison")
	@Operation(
		summary = "수령 방식별 시뮬레이션 상세 비교",
		description = """
          부동산 평가액을 기준으로 정액형, 초기증액형, 정기증가형 연금 수령액을 비교 분석합니다.
          동시성 방어를 위해 비관적 락(Pessimistic Lock)이 적용되어 있습니다.
          """
	)
	public ResponseEntity<ApiResponse<PensionPayoutComparisonResponse>> getPayoutComparison(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@PathVariable Long realAssetId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionPayoutService.compare(loginUser.getUserId(), realAssetId)));
	}

	@GetMapping("/{realAssetId}/payout-summary")
	@Operation(
		summary = "연금 설계 요약 정보 조회",
		description = "저장된 시뮬레이션 결과 중 추천 플랜의 요약 정보(월 수령액, 예상 총 수령액)를 빠르게 조회합니다."
	)
	public ResponseEntity<ApiResponse<PensionSimulationSummaryResponse>> getPayoutSummary(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@PathVariable Long realAssetId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(pensionPayoutService.getSummary(loginUser.getUserId(), realAssetId)));
	}
}
