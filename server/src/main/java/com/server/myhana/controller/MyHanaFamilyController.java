package com.server.myhana.controller;

import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.request.FamilyInviteAcceptRequest;
import com.server.myhana.dto.request.FamilyInviteRequest;
import com.server.myhana.dto.request.GrantInsuranceViewRequest;
import com.server.myhana.dto.response.FamilyMemberResponse;
import com.server.myhana.service.MyHanaFamilyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "MyHana Family", description = "마이하나 가족 관리 API")
@RestController
@RequestMapping("/api/myhana/family")
@RequiredArgsConstructor
public class MyHanaFamilyController {

    private final MyHanaFamilyService familyService;

    @Operation(summary = "가족 목록 조회", description = "본인 및 입증된(승인된) 가족 목록을 조회합니다.")
    @GetMapping
    public ApiResponse<List<FamilyMemberResponse>> getFamilyMembers(
            @AuthenticationPrincipal SubscriberDTO subscriberDTO) {
        return ApiResponse.onSuccess(familyService.getFamilyMembers(subscriberDTO.getUserId()));
    }

    @Operation(summary = "가족 초대하기", description = "휴대폰 번호를 통해 가족을 초대하고, 초대용 JWT 토큰을 발급합니다.")
    @PostMapping("/invite")
    public ApiResponse<String> inviteFamily(
            @AuthenticationPrincipal SubscriberDTO subscriberDTO,
            @RequestBody FamilyInviteRequest request) {
        String inviteToken = familyService.inviteFamily(subscriberDTO.getUserId(), request);
        return ApiResponse.onSuccess(inviteToken);
    }

    @Operation(summary = "가족 초대 수락 (가족 입증)", description = "받은 초대 토큰을 수락하여 가족 관계를 확정합니다.")
    @PostMapping("/accept")
    public ApiResponse<Void> acceptInvitation(
            @AuthenticationPrincipal SubscriberDTO subscriberDTO,
            @RequestBody FamilyInviteAcceptRequest request) {
        familyService.acceptInvitation(subscriberDTO.getUserId(), request);
        return ApiResponse.onSuccess(null);
    }

    @Operation(summary = "보험 내역 열람 권한 관리", description = "입증된 가족에게 보험 내역 열람 권한을 주거나 취소합니다.")
    @PatchMapping("/insurance-permission")
    public ApiResponse<Void> updateInsurancePermission(
            @AuthenticationPrincipal SubscriberDTO subscriberDTO,
            @RequestBody GrantInsuranceViewRequest request) {
        familyService.updateInsuranceViewPermission(subscriberDTO.getUserId(), request);
        return ApiResponse.onSuccess(null);
    }
}
