package com.server.myhana.controller;

import com.server.common.response.ApiResponse;
import com.server.myhana.dto.FamilyMemberResponse;
import com.server.myhana.dto.InsuranceResponse;
import com.server.myhana.dto.InsuranceShareRequest;
import com.server.myhana.service.MyHanaService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/myhana")
@RequiredArgsConstructor
public class MyHanaController {

  private final MyHanaService myHanaService;

  /**
   * 가족 관리 페이지 - 등록된 가족 목록 조회
   */
  @GetMapping("/family")
  public ApiResponse<List<FamilyMemberResponse>> getFamilyList(@RequestParam Long userId) {
    return ApiResponse.onSuccess(myHanaService.getFamilyList(userId));
  }

  /**
   * 보험 공유 과정 - 나의 보험 내역 조회
   */
  @GetMapping("/insurance")
  public ApiResponse<List<InsuranceResponse>> getMyInsurances(@RequestParam Long userId) {
    return ApiResponse.onSuccess(myHanaService.getMyInsurances(userId));
  }

  /**
   * 보험 공유 설정
   */
  @PostMapping("/insurance/share")
  public ApiResponse<String> shareInsurances(
      @RequestParam Long userId,
      @RequestBody InsuranceShareRequest request) {
    myHanaService.shareInsurances(userId, request.getGranteeId(), request.getInsuranceIds());
    return ApiResponse.onSuccess("보험 공유 설정이 완료되었습니다.");
  }

  /**
   * 보험 공유 중단
   */
  @PostMapping("/insurance/stop-sharing")
  public ApiResponse<String> stopSharingInsurances(
      @RequestParam Long userId,
      @RequestParam Long granteeId) {
    myHanaService.stopSharingInsurances(userId, granteeId);
    return ApiResponse.onSuccess("보험 공유가 중단되었습니다.");
  }
}
