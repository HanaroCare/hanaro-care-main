package com.server.asset.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.dto.dashboard.AssetDashboardResponse;
import com.server.asset.dto.dashboard.AssetDetailResponse;
import com.server.asset.dto.dashboard.FinancialAssetResponse;
import com.server.asset.service.AssetService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "자산 대시보드 API")
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

	@Operation(summary = "금융 자산 전체 목록 조회", description = "로그인한 사용자의 전체 금융 계좌 목록을 상세히 조회합니다.")
	@GetMapping("/financial")
	public ApiResponse<List<FinancialAssetResponse>> getFinancialAssets(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getFinancialAssets(subscriberDTO.getUserId()));
	}

	@Operation(summary = "부동산 상세 목록 조회")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					name = "부동산 목록 응답 예시",
					value = """
						{
						  "isSuccess": true,
						  "code": "COMMON200",
						  "message": "성공입니다.",
						  "result": [
						    {
						      "assetId": 3001,
						      "assetCateCd": "REAL_ESTATE",
						      "assetNm": "역삼동 아파트",
						      "amount": 920000000.0,
						      "addr": "서울 강남구 역삼동 123-45",
						      "assetSize": 84.0,
						      "assetDesc": "홍길동 자택",
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
	@GetMapping("/real-estate")
	public ApiResponse<List<AssetDetailResponse>> getRealEstateAssets(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getRealEstateAssets(subscriberDTO.getUserId()));
	}

	@Operation(summary = "자동차 상세 목록 조회")
	@GetMapping("/vehicle")
	public ApiResponse<List<AssetDetailResponse>> getVehicleAssets(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getVehicleAssets(subscriberDTO.getUserId()));
	}

	@Operation(summary = "보험 상세 목록 조회")
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					name = "보험 목록 응답 예시",
					value = """
						{
						  "isSuccess": true,
						  "code": "COMMON200",
						  "message": "성공입니다.",
						  "result": [
						    {
						      "assetId": 2005,
						      "assetCateCd": "INSURANCE",
						      "assetNm": "하나 건강보험",
						      "amount": 42000000.0,
						      "instNm": "하나생명",
						      "monthlyPremAmt": 150000.0,
						      "expireDt": "2030-12-31",
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
	@GetMapping("/insurance")
	public ApiResponse<List<AssetDetailResponse>> getInsuranceAssets(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getInsuranceAssets(subscriberDTO.getUserId()));
	}

	@Operation(summary = "금 자산 상세 목록 조회")
	@GetMapping("/gold")
	public ApiResponse<List<AssetDetailResponse>> getGoldAssets(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO
	) {
		return ApiResponse.onSuccess(assetService.getGoldAssets(subscriberDTO.getUserId()));
	}

}
