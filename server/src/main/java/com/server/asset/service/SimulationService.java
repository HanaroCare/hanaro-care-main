package com.server.asset.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.response.SimulationDetailResponse;
import com.server.asset.dto.response.SimulationSummaryResponse;

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
    public SimulationResponse createSimulation(Long userId, SimulationRequest request) {
        TBUser user = tbUserRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // AI 분석 결과를 시뮬레이션하는 가상 로직
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
            ageRangeDetails = "{}";
        }

        // DB 저장
        TBAssetSimulation simulation = TBAssetSimulation.builder()
            .user(user)
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

    public SimulationSummaryResponse getSimulationSummary(Long userId) {
        TBAssetSimulation simulation = tbAssetSimulationRepository.findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
            .orElseThrow(() -> new RuntimeException("Simulation result not found"));

        SimulationDetailResponse detailData;
        try {
            detailData = objectMapper.readValue(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);
        } catch (JsonProcessingException e) {
            detailData = SimulationDetailResponse.builder().build(); // 빈 데이터 처리
        }

        return SimulationSummaryResponse.builder()
            .isSufficient(simulation.getIsSufficient())
            .shortageAmt(simulation.getShortageAmt())
            .livingCost(simulation.getLivingCost())
            .medicalCost(simulation.getMedicalCost())
            .careCost(simulation.getCareCost())
            .ageSegments(detailData.getAgeSegments())
            .aiOpinion(detailData.getAiOpinion())
            .build();
    }

    public SimulationDetailResponse getSimulationDetail(Long userId, SimulationRequest request) {
        TBAssetSimulation simulation = tbAssetSimulationRepository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(userId, request.getTargetAge(), request.getCareType())
            .orElseThrow(() -> new RuntimeException("Simulation result not found for given criteria"));

        try {
            return objectMapper.readValue(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing simulation detail JSON", e);
        }
    }
}
