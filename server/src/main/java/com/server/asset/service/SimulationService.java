package com.server.asset.service;

import java.math.BigDecimal;

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

    if (aiResult.getAgeSegments() != null) {
      for (SimulationDetailResponse.AgeSegment segment : aiResult.getAgeSegments()) {
        // range 문자열("70-75세", "80-83세" 등)에서 실제 구간 개월 수를 파싱
        BigDecimal months = new BigDecimal(extractMonthsFromRange(segment.getRange()));

        totalAccumulatedCost = totalAccumulatedCost.add(segment.getExpense().multiply(months));
        totalAccumulatedIncome = totalAccumulatedIncome.add(segment.getIncome().multiply(months));

        if (segment.getDetail() != null) {
          totalAccumulatedLiving = totalAccumulatedLiving.add(segment.getDetail().getLiving().multiply(months));
          totalAccumulatedMedical = totalAccumulatedMedical.add(segment.getDetail().getMedical().multiply(months));
          totalAccumulatedCare = totalAccumulatedCare.add(segment.getDetail().getCare().multiply(months));
        }
      }
    }

    // 부족 금액 재계산 (누적 지출 - 누적 수입)
    BigDecimal shortageAmt = totalAccumulatedCost.subtract(totalAccumulatedIncome);
    boolean isSufficient = shortageAmt.compareTo(BigDecimal.ZERO) <= 0;
    String ageRangeDetails;
    try {
      ageRangeDetails = objectMapper.writeValueAsString(aiResult);
    } catch (JsonProcessingException e) {
      // 이미 정의해두신 에러 상태를 사용합니다.
      throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
    }
    // [DB 저장] 이제 '한 달치'가 아닌 '누적 합계'를 넣습니다.
    TBAssetSimulation simulation = TBAssetSimulation.builder()
        .user(UserRepository.getReferenceById(userId))
        .targetAge(request.getTargetAge())
        .careType(request.getCareType())
        .totalIncomeAmt(totalAccumulatedIncome) // 누적 수입
        .shortageAmt(shortageAmt)               // 누적 부족액
        .isSufficient(isSufficient)
        .livingCost(totalAccumulatedLiving)    // 누적 생활비
        .medicalCost(totalAccumulatedMedical)  // 누적 의료비
        .careCost(totalAccumulatedCare)        // 누적 요양비
        .monthlyCost(totalAccumulatedCost)     // 전체 총 지출
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
