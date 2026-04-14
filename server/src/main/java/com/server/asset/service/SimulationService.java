package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Arrays;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.request.SimulationRequest;
import com.server.asset.dto.response.SimulationDetailResponse;
import com.server.asset.dto.response.SimulationResponse;
import com.server.asset.dto.response.SimulationSummaryResponse;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.mapper.SimulationMapper;
import com.server.asset.repository.TBAssetSimulationRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.repository.TBUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SimulationService {

    private final TBAssetSimulationRepository tbAssetSimulationRepository;
    private final TBUserRepository tbUserRepository;
    private final SimulationMapper simulationMapper;
    private final ObjectMapper objectMapper;

    @Transactional
    @CheckUser(key = "#userId")
    public SimulationResponse createSimulation(Long userId, SimulationRequest request) {
        // AI 분석 결과를 시뮬레이션하는 가상 로직 (실제로는 여기서 복잡한 계산 수행)
        BigDecimal totalIncomeAmt = new BigDecimal("1450000.00");
        BigDecimal monthlyCost = new BigDecimal("2300000.00");
        BigDecimal shortageAmt = monthlyCost.subtract(totalIncomeAmt);
        boolean isSufficient = shortageAmt.compareTo(BigDecimal.ZERO) <= 0;

        BigDecimal livingCost = new BigDecimal("1500000.00");
        BigDecimal medicalCost = new BigDecimal("500000.00");
        BigDecimal careCost = new BigDecimal("300000.00");

        // 가상 상세 리포트 JSON 생성
        SimulationDetailResponse detailData = SimulationDetailResponse.builder()
            .incomeDetails(SimulationDetailResponse.IncomeDetails.builder()
                .nationalPension(new BigDecimal("1300000"))
                .retirementPension(new BigDecimal("500000"))
                .localSubsidyAmt(new BigDecimal("150000"))
                .localSubsidyName("서울시 고령자 지원금")
                .totalMonthlyIncome(new BigDecimal("1950000"))
                .build())
            .ageSegments(Arrays.asList(
                SimulationDetailResponse.AgeSegment.builder()
                    .range("65-70세")
                    .income(new BigDecimal("1950000"))
                    .expense(new BigDecimal("2300000"))
                    .detail(SimulationDetailResponse.AgeDetail.builder()
                        .living(new BigDecimal("800000"))
                        .medical(new BigDecimal("400000"))
                        .care(new BigDecimal("300000"))
                        .build())
                    .build(),
                SimulationDetailResponse.AgeSegment.builder()
                    .range("70-75세")
                    .income(new BigDecimal("1950000"))
                    .expense(new BigDecimal("2800000"))
                    .detail(SimulationDetailResponse.AgeDetail.builder()
                        .living(new BigDecimal("700000"))
                        .medical(new BigDecimal("800000"))
                        .care(new BigDecimal("500000"))
                        .build())
                    .build()
            ))
            .aiOpinion("75세 이후 의료비 상승에 대비한 자금 확보가 필요합니다.")
            .build();

        String ageRangeDetails;
        try {
            ageRangeDetails = objectMapper.writeValueAsString(detailData);
        } catch (JsonProcessingException e) {
            // JSON 생성 실패 시 명확한 에러 반환
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }

        // DB 저장 (사용자 한 명에 대해 여러 시뮬레이션이 가능하며, 최신 것이 최상단에 쌓임)
        TBAssetSimulation simulation = TBAssetSimulation.builder()
            .user(tbUserRepository.getReferenceById(userId))
            .targetAge(request.getTargetAge())
            .careType(request.getCareType())
            .totalIncomeAmt(totalIncomeAmt)
            .shortageAmt(shortageAmt)
            .isSufficient(isSufficient)
            .livingCost(livingCost)
            .medicalCost(medicalCost)
            .careCost(careCost)
            .monthlyCost(monthlyCost)
            .ageRangeDetails(ageRangeDetails)
            .build();

        TBAssetSimulation savedSimulation = tbAssetSimulationRepository.save(simulation);

        return simulationMapper.toSimulationResponse(savedSimulation);
    }

    @CheckUser(key = "#userId")
    public SimulationSummaryResponse getSimulationSummary(Long userId) {
        // 최신 시뮬레이션 결과 1건만 조회
        TBAssetSimulation simulation = tbAssetSimulationRepository.findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
            .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

        try {
            SimulationDetailResponse detailData = objectMapper.readValue(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);
            return simulationMapper.toSimulationSummaryResponse(simulation, detailData.getAgeSegments(), detailData.getAiOpinion());
        } catch (JsonProcessingException e) {
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }
    }

    @CheckUser(key = "#userId")
    public SimulationDetailResponse getSimulationDetail(Long userId, SimulationRequest request) {
        // 특정 조건(나이, 요양방식)에 맞는 가장 최신 시뮬레이션 결과 1건 조회
        TBAssetSimulation simulation = tbAssetSimulationRepository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(userId, request.getTargetAge(), request.getCareType())
            .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

        try {
            return objectMapper.readValue(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);
        } catch (JsonProcessingException e) {
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }
    }
}
