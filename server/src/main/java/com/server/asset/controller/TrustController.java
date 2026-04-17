package com.server.asset.controller;

import com.server.asset.dto.trust.TrustAgentViewUpdateRequest;
import com.server.asset.dto.trust.TrustGrantorResponse;
import com.server.asset.dto.trust.TrustPayoutSettingsUpdateRequest;
import com.server.asset.dto.trust.TrustProductResponse;
import com.server.asset.dto.trust.TrustSimulationSaveRequest;
import com.server.asset.service.TrustService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(name = "신탁 API", description = "신탁 설계 및 가입 후 운용 현황과 관련된 API입니다.")
public class TrustController {

	private final TrustService trustService;

	@PostMapping
	@Operation(
		summary = "신탁 설계 조건 저장",
		description = "신탁 설계 시 입력한 조건을 저장합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "저장 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400",
			description = "입력값 오류",
			content = @Content(
				examples = @ExampleObject(
					name = "시작일 누락",
					value = "{\"isSuccess\": false, \"code\": \"TRUST_004\", \"message\": \"날짜 지정 시 시작일은 필수입니다.\", \"result\": null}"
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404",
			description = "조회 실패",
			content = @Content(
				examples = {
					@ExampleObject(
						name = "유저 없음",
						value = "{\"isSuccess\": false, \"code\": \"TRUST_002\", \"message\": \"유저를 찾을 수 없습니다.\", \"result\": null}"
					),
					@ExampleObject(
						name = "대리인 없음",
						value = "{\"isSuccess\": false, \"code\": \"TRUST_003\", \"message\": \"대리인을 찾을 수 없습니다.\", \"result\": null}"
					)
				}
			)
		)
	})
	public ResponseEntity<ApiResponse<Void>> saveSimulation(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@Valid @RequestBody TrustSimulationSaveRequest request
	) {
		trustService.saveSimulation(loginUser.getUserId(), request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@GetMapping
	@Operation(
		summary = "내 신탁 설계 결과 조회",
		description = "로그인한 사용자의 신탁 설계 결과를 조회합니다. view 값에 따라 요약 또는 상세 결과를 반환합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400",
			description = "요청값 오류",
			content = @Content(
				examples = @ExampleObject(
					name = "잘못된 view 값",
					value = "{\"isSuccess\": false, \"code\": \"COMMON_400\", \"message\": \"view 파라미터는 summary 또는 detail 이어야 합니다.\", \"result\": null}"
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404",
			description = "정보 없음",
			content = @Content(
				examples = @ExampleObject(
					name = "시뮬레이션 정보 없음",
					value = "{\"isSuccess\": false, \"code\": \"TRUST_001\", \"message\": \"시뮬레이션 정보를 찾을 수 없습니다.\", \"result\": null}"
				)
			)
		)
	})
	public ResponseEntity<ApiResponse<?>> getSimulationResult(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@Parameter(description = "조회 유형 (summary | detail)", example = "summary")
		@RequestParam(defaultValue = "detail") String view
	) {
		Long userId = loginUser.getUserId();

		if ("summary".equalsIgnoreCase(view)) {
			return ResponseEntity.ok(
				ApiResponse.onSuccess(trustService.getSimulationSummary(userId))
			);
		}

		if ("detail".equalsIgnoreCase(view)) {
			return ResponseEntity.ok(
				ApiResponse.onSuccess(trustService.getSimulationDetail(userId))
			);
		}

		throw new IllegalArgumentException("view 파라미터는 summary 또는 detail 이어야 합니다.");
	}

	@GetMapping("/product")
	@Operation(
		summary = "가입한 신탁상품 운용 현황 조회",
		description = "로그인한 사용자가 가입한 신탁상품의 운용 현황을 조회합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404",
			description = "상품 없음",
			content = @Content(
				examples = @ExampleObject(
					value = "{\"isSuccess\": false, \"code\": \"ASSET_001\", \"message\": \"가입한 상품 정보를 찾을 수 없습니다.\", \"result\": null}"
				)
			)
		)
	})
	public ResponseEntity<ApiResponse<TrustProductResponse>> getProduct(
		@AuthenticationPrincipal SubscriberDTO loginUser
	) {
		return ResponseEntity.ok(
			ApiResponse.onSuccess(trustService.getProduct(loginUser.getUserId()))
		);
	}

	@PatchMapping("/product/payout-settings")
	@Operation(
		summary = "신탁 자금 사용처 수정",
		description = "가입한 신탁상품의 자금 사용처 설정을 수정합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400",
			description = "설정값 오류",
			content = @Content(
				examples = @ExampleObject(
					value = "{\"isSuccess\": false, \"code\": \"TRUST_008\", \"message\": \"집행 설정 정보가 올바르지 않습니다.\", \"result\": null}"
				)
			)
		)
	})
	public ResponseEntity<ApiResponse<Void>> updatePayoutSettings(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@Valid @RequestBody TrustPayoutSettingsUpdateRequest request
	) {
		trustService.updatePayoutSettings(loginUser.getUserId(), request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@PatchMapping("/product/agent-view")
	@Operation(
		summary = "신탁 현황 열람 권한 수정",
		description = "가입한 신탁상품에 대해 가족의 열람 권한을 수정합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404",
			description = "조회 실패",
			content = @Content(
				examples = {
					@ExampleObject(
						name = "상품 없음",
						value = "{\"isSuccess\": false, \"code\": \"ASSET_001\", \"message\": \"가입한 상품 정보를 찾을 수 없습니다.\", \"result\": null}"
					),
					@ExampleObject(
						name = "대리인 미설정",
						value = "{\"isSuccess\": false, \"code\": \"TRUST_003\", \"message\": \"대리인을 찾을 수 없습니다.\", \"result\": null}"
					)
				}
			)
		)
	})
	public ResponseEntity<ApiResponse<Void>> updateAgentView(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@Valid @RequestBody TrustAgentViewUpdateRequest request
	) {
		trustService.updateAgentView(loginUser.getUserId(), request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@GetMapping("/family/grantors")
	@Operation(
		summary = "부모별 신탁 권한 목록 조회",
		description = "로그인한 사용자(자녀/가족)가 부모별로 보유한 신탁 권한 수준 정보를 포함한 목록을 조회합니다. 권한이 없는 부모도 NONE으로 포함하여 반환합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
	})
	public ResponseEntity<ApiResponse<TrustGrantorResponse>> getFamilyGrantors(
		@AuthenticationPrincipal SubscriberDTO granteeUser
	) {
		return ResponseEntity.ok(
			ApiResponse.onSuccess(trustService.getFamilyGrantors(granteeUser.getUserId()))
		);
	}

	@GetMapping("/family/{grantorId}")
	@Operation(
		summary = "부모 신탁 조회",
		description = "로그인한 사용자(자녀/가족)가 부모의 신탁 정보를 조회합니다. view 값에 따라 요약 또는 상세 결과를 반환하며, 열람 권한이 없는 경우 조회할 수 없습니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400",
			description = "요청값 오류",
			content = @Content(
				examples = @ExampleObject(
					name = "잘못된 view 값",
					value = "{\"isSuccess\": false, \"code\": \"COMMON_400\", \"message\": \"view 파라미터는 summary 또는 detail 이어야 합니다.\", \"result\": null}"
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403",
			description = "권한 거부",
			content = @Content(
				examples = @ExampleObject(
					value = "{\"isSuccess\": false, \"code\": \"TRUST4032\", \"message\": \"신탁 조회 권한이 없습니다.\", \"result\": null}"
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404",
			description = "정보 없음",
			content = @Content(
				examples = {
					@ExampleObject(
						name = "시뮬레이션 정보 없음",
						value = "{\"isSuccess\": false, \"code\": \"TRUST_001\", \"message\": \"시뮬레이션 정보를 찾을 수 없습니다.\", \"result\": null}"
					),
					@ExampleObject(
						name = "상품 정보 없음",
						value = "{\"isSuccess\": false, \"code\": \"ASSET_001\", \"message\": \"가입한 상품 정보를 찾을 수 없습니다.\", \"result\": null}"
					)
				}
			)
		)
	})
	public ResponseEntity<ApiResponse<?>> getFamilyTrust(
		@AuthenticationPrincipal SubscriberDTO granteeUser,
		@PathVariable Long grantorId,
		@Parameter(description = "조회 유형 (summary | detail)", example = "summary")
		@RequestParam(defaultValue = "detail") String view
	) {
		Long granteeUserId = granteeUser.getUserId();

		if ("summary".equalsIgnoreCase(view)) {
			return ResponseEntity.ok(
				ApiResponse.onSuccess(trustService.getFamilySimulationSummary(granteeUserId, grantorId))
			);
		}

		if ("detail".equalsIgnoreCase(view)) {
			return ResponseEntity.ok(
				ApiResponse.onSuccess(trustService.getFamilyProduct(granteeUserId, grantorId))
			);
		}

		throw new IllegalArgumentException("view 파라미터는 summary 또는 detail 이어야 합니다.");
	}
}
