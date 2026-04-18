package com.server.asset.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.asset.dto.simulation.SimulationDetailResponse.AgeSegment;
import com.server.asset.dto.simulation.SimulationRequest;
import com.server.asset.dto.simulation.SimulationResponse;
import com.server.asset.dto.simulation.SimulationSummaryResponse;
import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.CareType;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.mapper.SimulationMapper;
import com.server.asset.repository.AssetSimulationRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.UserContextUtil;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SimulationService {

  private final AssetSimulationRepository assetSimulationRepository;
  private final UserRepository userRepository;
  private final UserProdRepository userProdRepository;
  private final SimulationMapper simulationMapper;
  private final UserContextUtil userContextUtil;
  private final SimulationEngine simulationEngine;
  private final ObjectMapper objectMapper;

  @Transactional
  @CheckUser(key = "#userId")
  @CacheEvict(value = "simulationDetail", key = "#userId + ':' + #request.targetAge + ':' + #request.careType.name()")
  public SimulationResponse createSimulation(Long userId, SimulationRequest request) {
    AIAnalysisInput input = userContextUtil.collectUserContext(userId, request);
    SimulationDetailResponse aiResult = simulationEngine.run(input);

    AccumulatedTotals totals = accumulateSegments(aiResult.getAgeSegments());
    TBAssetSimulation simulation = buildSimulationEntity(
        userId, request.getTargetAge(), request.getCareType(), totals, toJson(aiResult), false);

    return simulationMapper.toSimulationResponse(assetSimulationRepository.save(simulation));
  }

  @Transactional
  @CacheEvict(value = "simulationDetail", key = "#userId + ':' + #targetAge + ':' + #careType.name()")
  public void rerunLatestSimulation(Long userId, Integer targetAge, CareType careType) {
    boolean wasDefault = assetSimulationRepository
        .findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
        .map(TBAssetSimulation::getIsDefault)
        .orElse(false);

    SimulationRequest request = SimulationRequest.builder()
        .targetAge(targetAge)
        .careType(careType)
        .build();

    AIAnalysisInput input = userContextUtil.collectUserContext(userId, request);
    SimulationDetailResponse aiResult = simulationEngine.run(input);

    AccumulatedTotals totals = accumulateSegments(aiResult.getAgeSegments());
    assetSimulationRepository.save(
        buildSimulationEntity(userId, targetAge, careType, totals, toJson(aiResult), wasDefault));
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void createDefaultSimulationForUser(Long userId) {
    if (assetSimulationRepository.existsByUser_UserId(userId)) {
      return;
    }
    int userAge = userRepository.findById(userId)
        .map(u -> u.getUserAge())
        .orElse(30);
    int targetAge = Math.max(85, userAge + 30);

    SimulationRequest request = SimulationRequest.builder()
        .targetAge(targetAge)
        .careType(CareType.CENTER)
        .build();

    AIAnalysisInput input = userContextUtil.collectUserContext(userId, request);
    SimulationDetailResponse aiResult = simulationEngine.run(input);

    AccumulatedTotals totals = accumulateSegments(aiResult.getAgeSegments());
    assetSimulationRepository.save(
        buildSimulationEntity(userId, targetAge, CareType.CENTER, totals, toJson(aiResult), true));
  }

  @CheckUser(key = "#userId")
  public SimulationSummaryResponse getSimulationSummary(Long userId) {
    TBAssetSimulation simulation = assetSimulationRepository
        .findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

    SimulationDetailResponse detailData = fromJson(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);

    BigDecimal housingPensionPayout = userProdRepository
        .findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(
            userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS)
        .map(TBUserProd::getMonthlyPayout)
        .orElse(BigDecimal.ZERO);

    return simulationMapper.toSimulationSummaryResponse(
        simulation,
        detailData.getAgeSegments(),
        detailData.getAiOpinion(),
        housingPensionPayout
    );
  }

  @CheckUser(key = "#userId")
  @Cacheable(
      value = "simulationDetail",
      key = "#userId",
      unless = "#result == null"
  )
  public SimulationDetailResponse getSimulationDetail(Long userId) {
    TBAssetSimulation simulation = assetSimulationRepository
        .findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.SIMULATION_NOT_FOUND));

    return fromJson(simulation.getAgeRangeDetails(), SimulationDetailResponse.class);
  }

  private AccumulatedTotals accumulateSegments(List<AgeSegment> segments) {
    BigDecimal cost = BigDecimal.ZERO;
    BigDecimal living = BigDecimal.ZERO;
    BigDecimal medical = BigDecimal.ZERO;
    BigDecimal care = BigDecimal.ZERO;
    BigDecimal income = BigDecimal.ZERO;
    int totalMonths = 0;

    if (segments != null) {
      for (AgeSegment segment : segments) {
        int segmentMonths = extractMonthsFromRange(segment.getRange());
        BigDecimal months = new BigDecimal(segmentMonths);
        totalMonths += segmentMonths;

        cost = cost.add(segment.getExpense().multiply(months));
        income = income.add(segment.getIncome().multiply(months));

        if (segment.getDetail() != null) {
          living = living.add(segment.getDetail().getLiving().multiply(months));
          medical = medical.add(segment.getDetail().getMedical().multiply(months));
          care = care.add(segment.getDetail().getCare().multiply(months));
        }
      }
    }
    return new AccumulatedTotals(cost, living, medical, care, income, totalMonths);
  }

  private TBAssetSimulation buildSimulationEntity(Long userId, Integer targetAge, CareType careType,
      AccumulatedTotals totals, String ageRangeDetails, boolean isDefault) {
    BigDecimal totalShortageAmt = totals.cost().subtract(totals.income());
    BigDecimal monthlyShortageAmt = totals.months() > 0
        ? totalShortageAmt.divide(new BigDecimal(totals.months()), 0, RoundingMode.HALF_UP)
        : BigDecimal.ZERO;

    return TBAssetSimulation.builder()
        .user(userRepository.getReferenceById(userId))
        .targetAge(targetAge)
        .careType(careType)
        .totalIncomeAmt(totals.income())
        .shortageAmt(monthlyShortageAmt)
        .isSufficient(totalShortageAmt.compareTo(BigDecimal.ZERO) <= 0)
        .livingCost(totals.living())
        .medicalCost(totals.medical())
        .careCost(totals.care())
        .monthlyCost(totals.cost())
        .ageRangeDetails(ageRangeDetails)
        .isDefault(isDefault)
        .build();
  }

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

  private String toJson(Object obj) {
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (JsonProcessingException e) {
      throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
    }
  }

  private <T> T fromJson(String json, Class<T> clazz) {
    try {
      return objectMapper.readValue(json, clazz);
    } catch (JsonProcessingException e) {
      throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
    }
  }

  private record AccumulatedTotals(
      BigDecimal cost,
      BigDecimal living,
      BigDecimal medical,
      BigDecimal care,
      BigDecimal income,
      int months
  ) {}
}