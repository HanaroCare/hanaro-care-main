package com.server.asset.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.dto.link.RealAssetRequest;
import com.server.asset.service.AssetService;
import com.server.asset.service.RealAssetService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "자산 연동 API")
@RestController
@RequestMapping("/api/real-assets")
@RequiredArgsConstructor
public class LinkController {

	private final RealAssetService realAssetService;
	private final AssetService assetService;

	@Operation(
		summary = "금융 자산 연동 상태 변경",
		description = "선택한 금융 계좌들의 연동 여부를 업데이트합니다.",
		requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
			content = @Content(
				examples = @ExampleObject(value = "[2011, 2014]")
			)
		)
	)
	@PatchMapping("/link")
	public ApiResponse<String> updateAssetLinkStatus(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO,
		@RequestBody List<Long> accountIds
	) {
		assetService.updateAssetLinkStatus(subscriberDTO.getUserId(), accountIds);
		return ApiResponse.onSuccess("자산 연동 설정이 변경되었습니다.");
	}

	@Operation(summary = "부동산 연동")
	@PostMapping("/link/housing")
	public ApiResponse<Long> linkHousing(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO,
		@RequestBody RealAssetRequest.HousingLinkRequest request) {
		return ApiResponse.onSuccess(realAssetService.linkHousing(subscriberDTO.getUserId(), request));
	}

	@Operation(summary = "자동차 연동")
	@PostMapping("/link/vehicle")
	public ApiResponse<Long> linkVehicle(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO,
		@RequestBody RealAssetRequest.VehicleLinkRequest request) {
		return ApiResponse.onSuccess(realAssetService.linkVehicle(subscriberDTO.getUserId(), request));
	}

	@Operation(summary = "금 자산 연동")
	@PostMapping("/link/gold")
	public ApiResponse<Long> linkGold(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO,
		@RequestBody RealAssetRequest.GoldLinkRequest request) {
		return ApiResponse.onSuccess(realAssetService.linkGold(subscriberDTO.getUserId(), request));
	}

	@Operation(summary = "실물 자산 연동 해제")
	@DeleteMapping("/link/{realAssetId}")
	public ApiResponse<String> unlinkRealAsset(
		@AuthenticationPrincipal SubscriberDTO subscriberDTO,
		@PathVariable Long realAssetId) {
		realAssetService.unlinkRealAsset(subscriberDTO.getUserId(), realAssetId);
		return ApiResponse.onSuccess("연동이 해제되었습니다.");
	}

}
