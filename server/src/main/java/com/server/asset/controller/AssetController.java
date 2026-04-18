package com.server.asset.controller;

import com.server.asset.dto.dashboard.AssetChartPointDTO;
import com.server.asset.dto.dashboard.AssetDashboardResponse;
import com.server.asset.dto.dashboard.AssetDetailResponse;
import com.server.asset.dto.dashboard.FinancialAssetResponse;
import com.server.asset.dto.link.AccountLinkResponse;
import com.server.asset.service.AssetService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.service.MyDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "자산 대시보드 API")
@RestController
@RequestMapping("/api/asset")
@RequiredArgsConstructor
public class AssetController {

  private final AssetService assetService;
  private final MyDataService myDataService;

  @Operation(summary = "전체 자산 대시보드 조회")
  @GetMapping
  public ApiResponse<AssetDashboardResponse> getAssetDashboard(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO
  ) {
    return ApiResponse.onSuccess(assetService.getAssetDashboard(subscriberDTO.getUserId()));
  }

  @Operation(summary = "금융 자산 전체 목록 조회")
  @GetMapping("/financial")
  public ApiResponse<List<FinancialAssetResponse>> getFinancialAssets(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO
  ) {
    return ApiResponse.onSuccess(assetService.getFinancialAssets(subscriberDTO.getUserId()));
  }

  @Operation(summary = "실물 자산 상세 조회 (부동산, 자동차, 금)")
  @GetMapping("/real-asset/{realAssetId}")
  public ApiResponse<AssetDetailResponse> getRealAssetDetail(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable String realAssetId
  ) {
    return ApiResponse.onSuccess(
        assetService.getRealAssetDetail(subscriberDTO.getUserId(), Long.parseLong(realAssetId)));
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

  @Operation(summary = "6개월 자산 변화 차트 조회")
  @GetMapping("/chart")
  public ApiResponse<List<AssetChartPointDTO>> getAssetChart(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO
  ) {
    return ApiResponse.onSuccess(assetService.getAssetChart(subscriberDTO.getUserId()));
  }

  @Operation(summary = "마이데이터 연동 가능 계좌 목록 조회")
  @GetMapping("/link")
  public ApiResponse<List<AccountLinkResponse>> getConnectableAssets(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO
  ) {
    return ApiResponse.onSuccess(
        myDataService.getConnectableAssets(
            subscriberDTO.getUserId(), subscriberDTO.isHanaCertYn()));
  }

  @Operation(
      summary = "마이데이터 연동 상태 변경",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          content = @Content(examples = @ExampleObject(value = "[\"691274982960660480\", \"691274982960660481\"]"))
      )
  )
  @PatchMapping("/link")
  public ApiResponse<String> updateAssetLinkStatus(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @RequestBody List<String> selectedAccountIds
  ) {
    myDataService.updateAssetLinkStatus(
        subscriberDTO.getUserId(), selectedAccountIds, subscriberDTO.isHanaCertYn());
    return ApiResponse.onSuccess("자산 연동 설정이 변경되었습니다.");
  }
}