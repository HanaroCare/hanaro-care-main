package com.server.myhana.controller;

import com.server.myhana.dto.InsuranceDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/myhana/insurance")
public class InsuranceController {

  // 권한 확인한 후 보험 조회
  @GetMapping()
  InsuranceDto getInsurance(@RequestParam("inheritanceId") Boolean isOwner) {

  }

  // 권한 확인한 후 보험 상세 조회
  @GetMapping("/{inheritanceId}/{insuranceId}")
  void getInsuranceDetail() {

  }

}
