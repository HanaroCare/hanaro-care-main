package com.server.asset.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.asset.dto.simulation.SimulationRequest;
import com.server.asset.dto.simulation.SimulationResponse;
import com.server.asset.dto.simulation.SimulationSummaryResponse;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.mapper.SimulationMapper;
import com.server.asset.repository.AssetSimulationRepository;
import com.server.asset.util.UserContextUtil;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SimulationService {

  private final AssetSimulationRepository assetSimulationRepository;
  private final UserRepository UserRepository;
  private final SimulationMapper simulationMapper;
  private final UserContextUtil userContextUtil;
  private final SimulationEngine simulationEngine;
  private final ObjectMapper objectMapper;

  /**
   * "70-75세", "80-83세" 같은 range 문자열에서 실제 구간 개월 수를 파싱합니다.
   * 파싱 실패 시 기본값 60개월(5년)을 반환합니다.
   */
  private int extractMonthsFromRange(String range) {
    if (range == null || range.isBlank()) return 60;
    try {
      String cleaned = range.replace("세", "").trim();
      String[] parts = cleaned.split("-");
      int startAge = Integer.parseInt(parts[0].trim());
      int endAge = Integer.parseInt(parts[1].trim());
      int years = endAge - startAge;
      return years > 0 ? years * 12 : 60;
    } catch (Exception e) {
      return 60;
    }
  }

  @Transactional
  @CheckUser(key = "#userId")
  @CacheEvict(value = "simulationDetail", key = "#userId + ':' + #request.targetAge + ':' + #request.careType.name()")
  public SimulationResponse createSimulation(Long userId, SimulationRequest request) {
    AIAnalysisInput input = userContextUtil.collectUserContext(userId, request);
    SimulationDetailResponse aiResult = simulationEngine.run(input);

    BigDecimal totalAccumulatedCost = BigDecimal.ZERO;
    BigDecimal totalAccumulatedLiving = BigDecimal.ZERO;
    BigDecimal totalAccumulatedMedical = BigDecimal.ZERO;
    BigDecimal totalAccumulatedCare = BigDecimal.ZERO;
    BigDecimal totalAccumulatedIncome = BigDecimal.ZERO;

    int totalMonths = 0; // 루프 안에서 한 번에 계산하기 위해 이동

    if (aiResult.getAgeSegments() != null) {
      for (SimulationDetailResponse.AgeSegment segment : aiResult.getAgeSegments()) {
        int segmentMonths = extractMonthsFromRange(segment.getRange());
        BigDecimal months = new BigDecimal(segmentMonths);
        totalMonths += segmentMonths;

        totalAccumulatedCost = totalAccumulatedCost.add(segment.getExpense().multiply(months));
        totalAccumulatedIncome = totalAccumulatedIncome.add(segment.getIncome().multiply(months));

        if (segment.getDetail() != null) {
          totalAccumulatedLiving = totalAccumulatedLiving.add(segment.getDetail().getLiving().multiply(months));
          totalAccumulatedMedical = totalAccumulatedMedical.add(segment.getDetail().getMedical().multiply(months));
          totalAccumulatedCare = totalAccumulatedCare.add(segment.getDetail().getCare().multiply(months));
        }
      }
    }

    BigDecimal totalShortageAmt = totalAccumulatedCost.subtract(totalAccumulatedIncome);

    BigDecimal monthlyShortageAmt = totalMonths > 0
        ? totalShortageAmt.divide(new BigDecimal(totalMonths), 0, RoundingMode.HALF_UP)
        : BigDecimal.ZERO;

    boolean isSufficient = totalShortageAmt.compareTo(BigDecimal.ZERO) <= 0;

    String ageRangeDetails;
    try {
      ageRangeDetails = objectMapper.writeValueAsString(aiResult);
    } catch (JsonProcessingException e) {
      throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
    }

    TBAssetSimulation simulation = TBAssetSimulation.builder()
        .user(UserRepository.getReferenceById(userId))
        .targetAge(request.getTargetAge())
        .careType(request.getCareType())
        .totalIncomeAmt(totalAccumulatedIncome)
        .shortageAmt(monthlyShortageAmt) // 👈 이제 '월평균' 부족액이 DB에 들어감
        .isSufficient(isSufficient)
        .livingCost(totalAccumulatedLiving)
        .medicalCost(totalAccumulatedMedical)
        .careCost(totalAccumulatedCare)
        .monthlyCost(totalAccumulatedCost)
        .ageRangeDetails(ageRangeDetails)
        .build();

    TBAssetSimulation savedSimulation = assetSimulationRepository.save(simulation);
    return simulationMapper.toSimulationResponse(savedSimulation);
  }

  @CheckUser(key = "#userId")
  public SimulationSummaryResponse getSimulationSummary(Long userId) {
    TBAssetSimulation simulation = assetSimulationRepository.findFirstByUser_UserIdOrderByCreatedAtDesc(
            userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

    try {
      SimulationDetailResponse detailData = objectMapper.readValue(simulation.getAgeRangeDetails(),
          SimulationDetailResponse.class);
      return simulationMapper.toSimulationSummaryResponse(simulation, detailData.getAgeSegments(),
          detailData.getAiOpinion());
    } catch (JsonProcessingException e) {
      throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
    }
  }

  @CheckUser(key = "#userId")
  @Cacheable(
      value = "simulationDetail",
      key = "#userId + ':' + #request.targetAge + ':' + #request.careType.name()",
      unless = "#result == null"
  )
  public SimulationDetailResponse getSimulationDetail(Long userId, SimulationRequest request) {
    TBAssetSimulation simulation = assetSimulationRepository.findFirstByUser_UserIdAndTargetAgeAndCareTypeOrderByCreatedAtDesc(
            userId, request.getTargetAge(), request.getCareType())
        .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

    try {
      return objectMapper.readValue(simulation.getAgeRangeDetails(),
          SimulationDetailResponse.class);
    } catch (JsonProcessingException e) {
      throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
    }
  }
}
