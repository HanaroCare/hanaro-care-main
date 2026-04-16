package com.server.notification.controller;

import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.notification.dto.BannerStatusResponse;
import com.server.notification.service.BannerStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "홈 배너 알림 API", description = "홈 화면 배너 표시 여부를 결정하는 상태 정보를 제공합니다.")
public class BannerStatusController {

    private final BannerStatusService bannerStatusService;

    @GetMapping("/banner-status")
    @Operation(
        summary = "홈 배너 상태 조회",
        description = """
            홈 화면에 표시할 배너를 결정하기 위한 사용자 상태를 반환합니다.

            - hasCompletedSimulation: 병원비 시뮬레이션 완료 여부
            - hasInheritancePlan: 상속 설계(상속인 지정) 완료 여부
            - hasHousingPension: 주택연금 설계 완료 여부
            - hasTrustProduct: 신탁 상품 가입 여부
            - medicalBill: 요양보호사 카드가 있을 때만 반환 (없으면 null)
            - pension: 오늘이 연금 수령일일 때만 반환 (아니면 null)
            """
    )
    public ResponseEntity<ApiResponse<BannerStatusResponse>> getBannerStatus(
        @AuthenticationPrincipal SubscriberDTO loginUser
    ) {
        return ResponseEntity.ok(
            ApiResponse.onSuccess(bannerStatusService.getBannerStatus(loginUser.getUserId()))
        );
    }
}
