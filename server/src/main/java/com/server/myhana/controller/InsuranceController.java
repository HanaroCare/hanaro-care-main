package com.server.myhana.controller;

import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.InsuranceDetailDto;
import com.server.myhana.dto.InsuranceDto;
import com.server.myhana.service.InsuranceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "마이하나 API", description = "마이하나 API 입니다.")
@RestController
@RequestMapping("/myhana/insurance")
public class InsuranceController {

  private InsuranceService service;

  @Operation(summary = "보험 조회", description = "자신의 보험과 보험 공유를 허락해준 유저의 보험을 조회합니다.")
  @GetMapping
  List<InsuranceDto> getInsurance(@AuthenticationPrincipal
  SubscriberDTO user) {
    return service.getInsurances(user.getUserId());
  }

  // 권한 확인한 후 보험 상세 조회
  @Operation(summary = "보험 상세 조회", description = "선택한 보험 상세를 조회합니다.")
  @GetMapping("/{insuranceId}")
  InsuranceDetailDto getInsuranceDetail(@AuthenticationPrincipal
  SubscriberDTO user, @PathVariable Long insuranceId) {
    return service.getInsurance(user.getUserId(), insuranceId);
  }
}
