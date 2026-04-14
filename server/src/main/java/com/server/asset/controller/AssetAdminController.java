package com.server.asset.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.service.TrustAdminService;
import com.server.common.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/admin/asset")
@RequiredArgsConstructor
@Tag(name = "관리자(테스트) API", description = "자산 관련 테스트 간편화를 위한 API입니다")
@PreAuthorize("hasRole('ADMIN')")
public class AssetAdminController {

	private final TrustAdminService trustAdminService;

	@PostMapping("/trust/subscribe")
	@Operation(
		summary = "신탁 상품 가입 (테스트)",
		description = "저장된 신탁 설계 조건을 바탕으로 실제 신탁 상품 가입 처리를 시뮬레이션합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "가입 성공",
			content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": true,
                "code": "COMMON200",
                "message": "성공입니다.",
                "result": 125
              }
              """))
		)
	})
	public ApiResponse<Long> subscribeTrustProduct(
		@AuthenticationPrincipal Long userId
	) {
		Long userProdId = trustAdminService.subscribeTrustProduct(userId);
		return ApiResponse.onSuccess(userProdId);
	}

	@PostMapping("/trust/agent-view")
	@Operation(
		summary = "대리인 신탁 열람 권한 허용 (테스트)",
		description = "현재 유저가 가입 중인 신탁 상품을 찾아 대리인 열람 권한(isAgentView)을 true로 강제 설정합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "권한 설정 성공",
			content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": true,
                "code": "COMMON200",
                "message": "성공입니다.",
                "result": "대리인 열람 권한 허용 처리가 완료되었습니다."
              }
              """))
		)
	})
	public ApiResponse<String> enableAgentView(
		@AuthenticationPrincipal Long userId
	) {
		trustAdminService.enableAgentView(userId);
		return ApiResponse.onSuccess("대리인 열람 권한 허용 처리가 완료되었습니다.");
	}
}
