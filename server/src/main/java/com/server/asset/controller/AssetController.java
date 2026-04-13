package com.server.asset.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.service.AssetService;
import com.server.common.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Asset", description = "자산 관련 API")
@RestController
@RequestMapping("/api/asset")
@RequiredArgsConstructor
public class AssetController {
	private final AssetService assetService;

	@Operation(summary = "전체 자산 대시보드 조회")
	@GetMapping
	public ApiResponse<AssetDashboardResponse> getAssetDashboard(
		@AuthenticationPrincipal Long userId
	) {
		return ApiResponse.onSuccess(assetService.getAssetDashboard(userId));
	}
}
