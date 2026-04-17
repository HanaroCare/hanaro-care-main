package com.server.asset.controller;

import com.server.asset.dto.link.RealAssetLinkResponse;
import com.server.asset.dto.link.RealAssetRequest;
import com.server.asset.service.RealAssetService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "실물 자산 연동 API")
@RestController
@RequestMapping("/api/real-assets")
@RequiredArgsConstructor
public class LinkController {

  private final RealAssetService realAssetService;

  @Operation(
      summary = "부동산 연동",
      description = """
          주소·주택유형·면적·취득연도·대출여부를 저장하고 평가액을 반환합니다.
          - '연남' 포함 → 18억 5천만원 / '반포' 포함 → 29억 5천만원 / 기타 → 9억 2천만원
          """
  )
  @PostMapping("/link/housing")
  public ApiResponse<RealAssetLinkResponse> linkHousing(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @RequestBody RealAssetRequest.HousingLinkRequest request
  ) {
    return ApiResponse.onSuccess(
        realAssetService.linkHousing(
            subscriberDTO.getUserId(), request, subscriberDTO.isHanaCertYn()));
  }

  @Operation(
      summary = "차량 연동",
      description = """
          차량 번호로 시연용 차량 정보를 매칭해 저장합니다.
          - '3456' 포함 → 제네시스 G90(1.38억) / '8888' 포함 → BMW X7(1.52억) / 기타 → 제네시스 G70(0.46억)
          """
  )
  @PostMapping("/link/vehicle")
  public ApiResponse<RealAssetLinkResponse> linkVehicle(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @RequestBody RealAssetRequest.VehicleLinkRequest request
  ) {
    return ApiResponse.onSuccess(
        realAssetService.linkVehicle(
            subscriberDTO.getUserId(), request, subscriberDTO.isHanaCertYn()));
  }

  @Operation(
      summary = "금 자산 연동",
      description = "중량(g) × 118,500원(현재 시세)으로 평가액을 산출해 저장합니다."
  )
  @PostMapping("/link/gold")
  public ApiResponse<RealAssetLinkResponse> linkGold(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @RequestBody RealAssetRequest.GoldLinkRequest request
  ) {
    return ApiResponse.onSuccess(
        realAssetService.linkGold(
            subscriberDTO.getUserId(), request, subscriberDTO.isHanaCertYn()));
  }

  @Operation(summary = "실물 자산 연동 해제")
  @DeleteMapping("/link/{realAssetId}")
  public ApiResponse<String> unlinkRealAsset(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable Long realAssetId
  ) {
    realAssetService.unlinkRealAsset(subscriberDTO.getUserId(), realAssetId);
    return ApiResponse.onSuccess("연동이 해제되었습니다.");
  }
}
