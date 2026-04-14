package com.server.myhana.controller;

import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.InsuranceDetailDto;
import com.server.myhana.dto.InsuranceDto;
import com.server.myhana.service.InsuranceService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/myhana/insurance")
public class InsuranceController {

  private InsuranceService service;

  // 권한 확인한 후 보험 조회
  @GetMapping
  List<InsuranceDto> getInsurance(@RequestParam Boolean isOwner,
      @AuthenticationPrincipal
      SubscriberDTO user) {
    return service.getInsurances(user.getUserId());
  }

  // 권한 확인한 후 보험 상세 조회
  @GetMapping("/{insuranceId}")
  InsuranceDetailDto getInsuranceDetail(@RequestParam Boolean isOwner, @AuthenticationPrincipal
  SubscriberDTO user, @PathVariable Long insuranceId) {
    return service.getInsurance(user.getUserId(), insuranceId);
  }
}
