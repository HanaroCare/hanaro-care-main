package com.server.asset.controller;

import com.server.asset.dto.trust.TrustAccessResponse;
import com.server.asset.dto.trust.TrustAgentViewUpdateRequest;
import com.server.asset.dto.trust.TrustPayoutSettingsUpdateRequest;
import com.server.asset.dto.trust.TrustProductResponse;
import com.server.asset.dto.trust.TrustSimulationResultResponse;
import com.server.asset.dto.trust.TrustSimulationSaveRequest;
import com.server.asset.service.TrustService;
import com.server.common.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asset/trust")
@RequiredArgsConstructor
@Tag(name = "신탁 API", description = "신탁 설계 및 운용현황과 관련된 API입니다.")
public class TrustController {

	private final TrustService trustService;

	@PostMapping
	@Operation(
		summary = "신탁 설계 조건 저장",
		description = "신탁 설계 시 지정한 조건들을 저장하여 이후에도 같은 조건의 결과를 조회할 수 있도록 합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "저장 성공",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": "COMMON200",
				  "message": "성공입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "CUSTOM 시작 유형인데 startDate 누락",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_004",
				  "message": "날짜 지정 시 시작일은 필수입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "유저 또는 대리인 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_002",
				  "message": "유저를 찾을 수 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<Void>> saveSimulation(
		@AuthenticationPrincipal Long userId,
		@Valid @RequestBody TrustSimulationSaveRequest request
	) {
		trustService.saveSimulation(userId, request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@GetMapping("/summary")
	@Operation(
		summary = "신탁 설계 결과 간편 조회",
		description = "자산 설계 메인 화면 카드용 신탁 설계 결과 요약본을 조회합니다."
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
				    "principalAmount": 50000000,
				    "expectedProfit": 11832197,
				    "tax": 1822158,
				    "expectedNetAmount": 60010039,
				    "profitRate": 20.0
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "시뮬레이션 정보 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_001",
				  "message": "시뮬레이션 정보를 찾을 수 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<TrustSimulationResultResponse.SimulationDetailDto>> getSimulationSummary(
		@AuthenticationPrincipal Long userId
	) {
		return ResponseEntity.ok(
			ApiResponse.onSuccess(trustService.getSimulationSummary(userId))
		);
	}

	@GetMapping
	@Operation(
		summary = "신탁 설계 결과 상세 조회",
		description = "신탁 설계 결과와 예치 금액별 비교 데이터를 조회합니다."
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
				    "selectedDetail": {
				      "principalAmount": 50000000,
				      "expectedProfit": 11832197,
				      "tax": 1822158,
				      "expectedNetAmount": 60010039,
				      "profitRate": 20.0
				    },
				    "amountResults": [
				      {
				        "label": "1천만",
				        "principalAmount": 10000000,
				        "expectedProfit": 2366439,
				        "tax": 364431,
				        "expectedNetAmount": 12002008,
				        "profitRate": 20.0,
				        "isSelected": false
				      },
				      {
				        "label": "3천만",
				        "principalAmount": 30000000,
				        "expectedProfit": 7099318,
				        "tax": 1093294,
				        "expectedNetAmount": 36006024,
				        "profitRate": 20.0,
				        "isSelected": false
				      },
				      {
				        "label": "5천만",
				        "principalAmount": 50000000,
				        "expectedProfit": 11832197,
				        "tax": 1822158,
				        "expectedNetAmount": 60010039,
				        "profitRate": 20.0,
				        "isSelected": true
				      }
				    ]
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "시뮬레이션 정보 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_001",
				  "message": "시뮬레이션 정보를 찾을 수 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<TrustSimulationResultResponse>> getSimulationResult(
		@AuthenticationPrincipal Long userId
	) {
		return ResponseEntity.ok(
			ApiResponse.onSuccess(trustService.getSimulationResult(userId))
		);
	}

	@GetMapping("/{userProdId}/summary")
	@Operation(
		summary = "가입한 신탁상품 운용 현황 조회",
		description = "가입한 신탁상품의 현재 자산, 수익률, 집행 설정 등 운용 현황 요약 정보를 조회합니다."
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
				    "userProdId": 1234567890,
				    "productName": "내맘대로신탁",
				    "prodStatus": "IN_PROGRESS",
				    "currentAmount": 51500000,
				    "profitRate": 20.0,
				    "principalAmount": 50000000,
				    "executionAmount": 1500000,
				    "profit": 1500000,
				    "executionSetting": {
				      "hospitalEnabled": true,
				      "hospitalAmount": 500000,
				      "livingEnabled": true,
				      "livingAmount": 250000
				    }
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "본인 상품이 아님",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON403",
				  "message": "금지된 요청입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "상품 정보 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "ASSET_001",
				  "message": "가입한 상품 정보를 찾을 수 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<TrustProductResponse>> getProductSummary(
		@AuthenticationPrincipal Long userId,
		@PathVariable Long userProdId
	) {
		return ResponseEntity.ok(
			ApiResponse.onSuccess(trustService.getProductSummary(userId, userProdId))
		);
	}

	@PatchMapping("/products/{userProdId}/payout-settings")
	@Operation(
		summary = "신탁 자금 사용처 수정",
		description = "병원비/생활비 집행 항목과 금액을 수정합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "수정 성공",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": "COMMON200",
				  "message": "성공입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "본인 상품이 아님",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON403",
				  "message": "금지된 요청입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "상품 정보 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "ASSET_001",
				  "message": "가입한 상품 정보를 찾을 수 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<Void>> updatePayoutSettings(
		@AuthenticationPrincipal Long userId,
		@PathVariable Long userProdId,
		@Valid @RequestBody TrustPayoutSettingsUpdateRequest request
	) {
		trustService.updatePayoutSettings(userId, userProdId, request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@PatchMapping("/products/{userProdId}/agent-view")
	@Operation(
		summary = "신탁 현황 열람 권한 수정",
		description = "지급청구대리인의 신탁 현황 열람 권한을 수정합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "수정 성공",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": "COMMON200",
				  "message": "성공입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "본인 상품이 아님",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "COMMON403",
				  "message": "금지된 요청입니다.",
				  "result": null
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "대리인 미설정 또는 상품 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_003",
				  "message": "대리인을 찾을 수 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<Void>> updateAgentView(
		@AuthenticationPrincipal Long userId,
		@PathVariable Long userProdId,
		@Valid @RequestBody TrustAgentViewUpdateRequest request
	) {
		trustService.updateAgentView(userId, userProdId, request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@GetMapping("/{grantorUserId}/access")
	@Operation(
		summary = "가족 신탁 권한 수준 조회",
		description = "자녀가 부모의 신탁에 대해 어떤 권한 수준(Enum)을 가졌는지 조회합니다."
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
				    "grantorUserId": 1001,
				    "granteeUserId": 2002,
				    "accessLevel": "READ_WRITE"
				  }
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<TrustAccessResponse>> getTrustAccess(
		@AuthenticationPrincipal Long granteeUserId,
		@PathVariable Long grantorUserId
	) {
		return ResponseEntity.ok(
			ApiResponse.onSuccess(trustService.getTrustAccess(granteeUserId, grantorUserId))
		);
	}

	@GetMapping("/family/{grantorId}/summary")
	@Operation(
		summary = "부모 신탁 요약 조회 (자녀용)",
		description = "자녀가 부모의 신탁 설계 결과 요약본을 조회합니다. 부모가 신탁 열람 권한(IS_TRUST_VIEW)을 허용한 경우에만 조회 가능합니다."
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
				    "principalAmount": 50000000,
				    "expectedProfit": 11832197,
				    "tax": 1822158,
				    "expectedNetAmount": 60010039,
				    "profitRate": 20.0
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "열람 권한 거부 (부모가 설정을 끔)",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_005",
				  "message": "신탁 정보 열람 권한이 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<TrustSimulationResultResponse.SimulationDetailDto>> getFamilyTrustSummary(
		@AuthenticationPrincipal Long granteeUserId,
		@PathVariable Long grantorId
	) {
		trustService.validateTrustAccess(granteeUserId, grantorId);
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getSimulationSummary(grantorId)));
	}

	@GetMapping("/family/{grantorId}/detail")
	@Operation(
		summary = "부모 신탁 상세 조회 (자녀용)",
		description = "자녀가 부모의 신탁 상품 운용 현황을 상세 조회합니다. 부모가 신탁 열람 권한(IS_TRUST_VIEW)을 허용한 경우에만 조회 가능합니다."
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
				    "userProdId": 987654321,
				    "productName": "부모님 안심 신탁",
				    "prodStatus": "IN_PROGRESS",
				    "currentAmount": 102500000,
				    "profitRate": 4.5,
				    "principalAmount": 100000000,
				    "executionAmount": 2000000,
				    "profit": 2500000,
				    "executionSetting": {
				      "hospitalEnabled": true,
				      "hospitalAmount": 1000000,
				      "livingEnabled": false,
				      "livingAmount": 0
				    }
				  }
				}
				"""))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "열람 권한 없음",
			content = @Content(examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": "TRUST_005",
				  "message": "신탁 정보 열람 권한이 없습니다.",
				  "result": null
				}
				"""))
		)
	})
	public ResponseEntity<ApiResponse<TrustProductResponse>> getFamilyTrustDetail(
		@AuthenticationPrincipal Long granteeUserId,
		@PathVariable Long grantorId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getFamilyTrustDetail(granteeUserId, grantorId)));
	}
}
