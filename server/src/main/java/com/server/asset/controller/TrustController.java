package com.server.asset.controller;

import com.server.asset.dto.trust.TrustAccessResponse;
import com.server.asset.dto.trust.TrustAgentViewUpdateRequest;
import com.server.asset.dto.trust.TrustGrantorResponse;
import com.server.asset.dto.trust.TrustPayoutSettingsUpdateRequest;
import com.server.asset.dto.trust.TrustProductResponse;
import com.server.asset.dto.trust.TrustSimulationResultResponse;
import com.server.asset.dto.trust.TrustSimulationSaveRequest;
import com.server.asset.service.TrustService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;

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
	@Operation(summary = "신탁 설계 조건 저장", description = "신탁 설계 시 지정한 조건들을 저장합니다.")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "저장 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "입력값 오류",
			content = @Content(examples = @ExampleObject(name = "시작일 누락", value = "{\"isSuccess\": false, \"code\": \"TRUST_004\", \"message\": \"날짜 지정 시 시작일은 필수입니다.\", \"result\": null}"))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "조회 실패",
			content = @Content(examples = {
				@ExampleObject(name = "유저 없음", value = "{\"isSuccess\": false, \"code\": \"TRUST_002\", \"message\": \"유저를 찾을 수 없습니다.\", \"result\": null}"),
				@ExampleObject(name = "대리인 없음", value = "{\"isSuccess\": false, \"code\": \"TRUST_003\", \"message\": \"대리인을 찾을 수 없습니다.\", \"result\": null}")
			})
		)
	})
	public ResponseEntity<ApiResponse<Void>> saveSimulation(
		@AuthenticationPrincipal SubscriberDTO loginUser,
		@Valid @RequestBody TrustSimulationSaveRequest request
	) {
		trustService.saveSimulation(loginUser.getUserId(), request);
		return ResponseEntity.ok(ApiResponse.onSuccess(null));
	}

	@GetMapping("/summary")
	@Operation(summary = "신탁 설계 결과 요약 조회", description = "메인 화면 카드용 요약본을 조회합니다.")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "정보 없음",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"TRUST_001\", \"message\": \"시뮬레이션 정보를 찾을 수 없습니다.\", \"result\": null}"))
		)
	})
	public ResponseEntity<ApiResponse<TrustSimulationResultResponse.SimulationDetailDto>> getSimulationSummary(
		@AuthenticationPrincipal SubscriberDTO loginUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getSimulationSummary(loginUser.getUserId())));
	}

	@GetMapping
	@Operation(summary = "신탁 설계 결과 상세 조회", description = "비교 데이터 포함 전체 결과를 조회합니다.")
	public ResponseEntity<ApiResponse<TrustSimulationResultResponse>> getSimulationResult(
		@AuthenticationPrincipal SubscriberDTO loginUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getSimulationResult(loginUser.getUserId())));
	}

	@GetMapping("/product/summary")
	@Operation(summary = "가입한 신탁상품 운용 현황 조회")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "상품 없음",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"ASSET_001\", \"message\": \"가입한 상품 정보를 찾을 수 없습니다.\", \"result\": null}"))
		)
	})
	public ResponseEntity<ApiResponse<TrustProductResponse>> getProductSummary(
		@AuthenticationPrincipal SubscriberDTO loginUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getProductSummary(loginUser.getUserId())));
	}

	@PatchMapping("/product/payout-settings")
	@Operation(summary = "신탁 자금 사용처 수정")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "설정값 오류",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"TRUST_008\", \"message\": \"집행 설정 정보가 올바르지 않습니다.\", \"result\": null}"))
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
	@Operation(summary = "신탁 현황 열람 권한 수정")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "조회 실패",
			content = @Content(examples = {
				@ExampleObject(name = "상품 없음", value = "{\"isSuccess\": false, \"code\": \"ASSET_001\", \"message\": \"가입한 상품 정보를 찾을 수 없습니다.\", \"result\": null}"),
				@ExampleObject(name = "대리인 미설정", value = "{\"isSuccess\": false, \"code\": \"TRUST_003\", \"message\": \"대리인을 찾을 수 없습니다.\", \"result\": null}")
			})
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
		summary = "신탁 조회 가능한 가족(grantor) 목록 조회",
		description = "로그인한 사용자(자녀/가족)가 신탁 조회 권한을 부여받은 부모 목록을 반환합니다. 이 목록에서 grantorId를 얻어 /family/{grantorId}/summary 또는 /detail을 호출합니다."
	)
	public ResponseEntity<ApiResponse<TrustGrantorResponse>> getFamilyGrantors(
		@AuthenticationPrincipal SubscriberDTO granteeUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getFamilyGrantors(granteeUser.getUserId())));
	}

	@GetMapping("/family/access")
	@Operation(
		summary = "가족 신탁 권한 수준 조회",
		description = "로그인한 사용자(자녀)가 조회 가능한 모든 부모(grantor)의 신탁 권한 수준 목록을 반환합니다."
	)
	public ResponseEntity<ApiResponse<TrustAccessResponse>> getFamilyAccessList(
		@AuthenticationPrincipal SubscriberDTO granteeUser
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getFamilyAccessList(granteeUser.getUserId())));
	}

	@GetMapping("/family/{grantorId}/summary")
	@Operation(summary = "부모 신탁 요약 조회 (자녀용)")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "권한 거부",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"TRUST4032\", \"message\": \"신탁 조회 권한이 없습니다.\", \"result\": null}"))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "정보 없음",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"TRUST_001\", \"message\": \"시뮬레이션 정보를 찾을 수 없습니다.\", \"result\": null}"))
		)
	})
	public ResponseEntity<ApiResponse<TrustSimulationResultResponse.SimulationDetailDto>> getFamilyTrustSummary(
		@AuthenticationPrincipal SubscriberDTO granteeUser,
		@PathVariable Long grantorId
	) {
		trustService.validateTrustAccess(granteeUser.getUserId(), grantorId);
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getSimulationSummary(grantorId)));
	}

	@GetMapping("/family/{grantorId}/detail")
	@Operation(summary = "부모 신탁 상세 조회 (자녀용)")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "403", description = "권한 거부",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"TRUST4032\", \"message\": \"신탁 조회 권한이 없습니다.\", \"result\": null}"))
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", description = "상품 없음",
			content = @Content(examples = @ExampleObject(value = "{\"isSuccess\": false, \"code\": \"ASSET_001\", \"message\": \"가입한 상품 정보를 찾을 수 없습니다.\", \"result\": null}"))
		)
	})
	public ResponseEntity<ApiResponse<TrustProductResponse>> getFamilyTrustDetail(
		@AuthenticationPrincipal SubscriberDTO granteeUser,
		@PathVariable Long grantorId
	) {
		return ResponseEntity.ok(ApiResponse.onSuccess(trustService.getFamilyTrustDetail(granteeUser.getUserId(), grantorId)));
	}
}
