package com.server.asset.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.service.TrustAdminService;
import com.server.common.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/asset")
@RequiredArgsConstructor
@Tag(name = "관리자(테스트) API", description = "자산 관련 테스트 간편화를 위한 API입니다")
public class AssetAdminController {
	private final TrustAdminService trustAdminService;

	@PostMapping("/trust/subscribe")
	@Operation(
		summary = "신탁 상품 가입",
		description = "저장된 신탁 설계 조건과 계산 결과를 바탕으로 실제 상품을 가입합니다."
	)
	public ResponseEntity<ApiResponse<Long>> subscribeTrustProduct(
		@AuthenticationPrincipal Long userId
	) {
		Long userProdId = trustAdminService.subscribeTrustProduct(userId);
		return ResponseEntity.ok(ApiResponse.onSuccess(userProdId));
	}


	// 대리인에게 신탁 현황 열람 권한 허용하기
}
