package com.server.asset.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.simulation.SimulationRequest;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.asset.dto.simulation.SimulationResponse;
import com.server.asset.dto.simulation.SimulationSummaryResponse;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.mapper.SimulationMapper;
import com.server.asset.repository.TBAssetSimulationRepository;
import com.server.asset.util.UserContextUtil;
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
    private final UserContextUtil userContextUtil;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    @Transactional
    @CheckUser(key = "#userId")
    public SimulationResponse createSimulation(Long userId, SimulationRequest request) {
        // 1. 사용자 컨텍스트 수집 (소비, 거주지, 자산 등)
        AIAnalysisInput input = userContextUtil.collectUserContext(userId, request);

        // 2. AI 분석 엔진 호출 (Gemini LLM)
        SimulationDetailResponse aiResult = aiService.analyzeFutureCosts(input);

        // 3. 분석 결과를 DB 엔티티로 변환 및 요약 정보 계산
        BigDecimal totalIncomeAmt = aiResult.getIncomeDetails().getTotalMonthlyIncome();
        BigDecimal monthlyCost = aiResult.getAgeSegments().isEmpty() ? BigDecimal.ZERO : 
            aiResult.getAgeSegments().get(0).getExpense();
        BigDecimal shortageAmt = monthlyCost.subtract(totalIncomeAmt);
        boolean isSufficient = shortageAmt.compareTo(BigDecimal.ZERO) <= 0;

        // 상세 비용 추출 (첫 번째 세그먼트 기준)
        SimulationDetailResponse.AgeDetail firstDetail = aiResult.getAgeSegments().get(0).getDetail();

        String ageRangeDetails;
        try {
            ageRangeDetails = objectMapper.writeValueAsString(aiResult);
        } catch (JsonProcessingException e) {
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }

        // 4. DB 저장
        TBAssetSimulation simulation = TBAssetSimulation.builder()
            .user(tbUserRepository.getReferenceById(userId))
            .targetAge(request.getTargetAge())
            .careType(request.getCareType())
            .totalIncomeAmt(totalIncomeAmt)
            .shortageAmt(shortageAmt)
            .isSufficient(isSufficient)
            .livingCost(firstDetail.getLiving())
            .medicalCost(firstDetail.getMedical())
            .careCost(firstDetail.getCare())
            .monthlyCost(monthlyCost)
            .ageRangeDetails(ageRangeDetails)
            .build();

        TBAssetSimulation savedSimulation = tbAssetSimulationRepository.save(simulation);

        return simulationMapper.toSimulationResponse(savedSimulation);
    }

    @CheckUser(key = "#userId")
    public SimulationSummaryResponse getSimulationSummary(Long userId) {
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
        TBAssetSimulation simulation = tbAssetSimulationRepository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(userId, request.getTargetAge(), request.getCareType())
            .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

        try {
            return objectMapper.readValue(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);
        } catch (JsonProcessingException e) {
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }
    }
}
