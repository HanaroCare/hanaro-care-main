package com.server.simulation.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.simulation.dto.request.SimulationRequest;
import com.server.simulation.dto.response.SimulationResponse;
import com.server.simulation.service.SimulationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Simulation", description = "AI 시뮬레이션 관련 API")
@RestController
@RequestMapping("/api/asset/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @Operation(summary = "AI 자산 시뮬레이션 생성", description = "사용자 입력값과 마이데이터를 기반으로 AI 분석을 수행하고 결과를 생성합니다.")
    @PostMapping
    public ApiResponse<SimulationResponse> createSimulation(
        @AuthenticationPrincipal SubscriberDTO subscriberDTO,
        @RequestBody SimulationRequest request
    ) {
        return ApiResponse.onSuccess(simulationService.createSimulation(subscriberDTO.getUserId(), request));
    }
}
