package com.server.asset.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.dto.response.FinancialAssetResponse;
import com.server.asset.service.AssetService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getAssetDashboard(subscriberDTO.getUserId()));
	}

	@Operation(summary = "금융 자산 상세 목록 조회", description = "로그인한 사용자의 전체 금융 계좌 목록을 상세히 조회합니다.")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					name = "금융 자산 목록 응답 예시",
					value = """
						{
						  "isSuccess": true,
						  "code": "COMMON200",
						  "message": "성공입니다.",
						  "result": [
						    {
						      "accountId": 2001,
						      "assetCateCd": "CASH",
						      "instNm": "하나은행",
						      "accountNm": "하나 자유입출금",
						      "accountNum": "111-222-333333",
						      "balanceAmt": 50000000.00,
						      "profitRate": null,
						      "createdAt": "2026-04-14T10:00:00",
						      "updatedAt": "2026-04-14T10:00:00"
						    }
						  ]
						}
						"""
				)
			)
		)
	})
	@GetMapping("/financial")
	public ApiResponse<List<FinancialAssetResponse>> getFinancialAssets(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getFinancialAssets(subscriberDTO.getUserId()));
	}
}
