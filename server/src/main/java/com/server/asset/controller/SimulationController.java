package com.server.asset.controller;

import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.asset.dto.simulation.SimulationRequest;
import com.server.asset.dto.simulation.SimulationResponse;
import com.server.asset.dto.simulation.SimulationSummaryResponse;
import com.server.asset.service.SimulationService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "시뮬레이션 API")
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
    return ApiResponse.onSuccess(
        simulationService.createSimulation(subscriberDTO.getUserId(), request));
  }

  @Operation(summary = "시뮬레이션 요약 조회", description = "가장 최근에 완료된 시뮬레이션의 요약 정보를 조회합니다.")
  @GetMapping("/summary")
  public ApiResponse<SimulationSummaryResponse> getSimulationSummary(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO
  ) {
    return ApiResponse.onSuccess(simulationService.getSimulationSummary(subscriberDTO.getUserId()));
  }

  @Operation(summary = "시뮬레이션 상세 조회", description = "가장 최근 시뮬레이션의 상세 내역(연령대별 지출 등)을 조회합니다.")
  @GetMapping("/detail")
  public ApiResponse<SimulationDetailResponse> getSimulationDetail(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO
  ) {
    return ApiResponse.onSuccess(
        simulationService.getSimulationDetail(subscriberDTO.getUserId()));
  }
}
