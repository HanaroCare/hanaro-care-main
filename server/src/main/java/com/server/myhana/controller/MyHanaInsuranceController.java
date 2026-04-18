package com.server.myhana.controller;

import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.InsuranceDetailDto;
import com.server.myhana.dto.InsuranceDto;
import com.server.myhana.dto.InsuranceListResponse;
import com.server.myhana.service.MyHanaInsuranceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "마이하나 API", description = "마이하나 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myhana/insurances")
public class MyHanaInsuranceController {

  private final MyHanaInsuranceService service;


  @Operation(summary = "보험 조회", description = "자신의 보험과 보험 공유를 허락해준 유저의 보험을 조회합니다. 보험청구 대리인")
  @GetMapping
  ApiResponse<InsuranceListResponse> getInsurance(@AuthenticationPrincipal
  SubscriberDTO user) {
    List<InsuranceDto> insurances = service.getInsurances(user.getUserId());
    Boolean isInsAgent = service.isInsAgent(user.getUserId());

    InsuranceListResponse result = new InsuranceListResponse(insurances, isInsAgent);
    return ApiResponse.onSuccess(result);
  }

  // 권한 확인한 후 보험 상세 조회
  @Operation(summary = "보험 상세 조회", description = "선택한 보험 상세를 조회합니다.")
  @GetMapping("/{insuranceId}")
  ApiResponse<InsuranceDetailDto> getInsuranceDetail(@AuthenticationPrincipal
      SubscriberDTO user,
      @Parameter(description = "보험 ID", example = "2005") @PathVariable String insuranceId) {
    InsuranceDetailDto result = service.getInsurance(user.getUserId(), Long.parseLong(insuranceId));
    return ApiResponse.onSuccess(result);
  }
}
