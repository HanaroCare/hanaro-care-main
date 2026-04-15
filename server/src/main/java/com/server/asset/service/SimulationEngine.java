package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.server.asset.client.BokjiroClient;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.external.publicdata.PublicDataResponse;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.common.config.external.ExternalApiProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationEngine {

    private final AIService aiService;
    private final NationalPensionService pensionService;
    private final BokjiroClient bokjiroClient;
    private final ExternalApiProperties apiProperties;

    // 통계 기반 상수 (2024-2025 최신 데이터 반영)
    private static final BigDecimal AVG_WAGE_GROWTH = new BigDecimal("2.9"); // 우리나라 평균 임금 인상률 (2.9%)
    private static final BigDecimal SENIOR_MEDICAL_COST_YEAR = new BigDecimal("6000000"); // 노인 1인당 연평균 진료비 (약 600만원)
    private static final BigDecimal MEDICAL_INFLATION = new BigDecimal("4.5"); // 의료비 물가상승률 (고정값 사용)

    public SimulationDetailResponse run(AIAnalysisInput input) {
        // 1. 핵심 지표 산출
        BigDecimal medicalInflation = MEDICAL_INFLATION;
        
        // 임금 인상률을 반영한 예상 연금 (단순화: 매년 임금 상승분만큼 연금 가치도 소폭 상승한다고 가정하거나, 
        // 소비지출의 미래 가치를 계산할 때 임금 상승률을 참고할 수 있음)
        BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
            input.getUserAge(), input.getAverageMonthlySpending(), 20);
        
        List<String> welfareServices = fetchWelfareServices(input.getUserAddr());

        log.info("[Simulation Start] User Age: {}, Target Age: {}, Care Type: {}", 
            input.getUserAge(), input.getTargetAge(), input.getCareType());
        log.info("[Simulation Metrics] Medical Inflation: {}%, Wage Growth: {}%, Welfare Services Count: {}", 
            medicalInflation, AVG_WAGE_GROWTH, welfareServices.size());

        // 2. AI 분석 시도
        try {
            log.info("[Simulation Path] Attempting AI Analysis via Gemini...");
            SimulationDetailResponse aiResult = aiService.analyzeFutureCosts(input, medicalInflation, welfareServices, estimatedPension);
            log.info("[Simulation Success] AI Analysis completed successfully.");
            return aiResult;
        } catch (Exception e) {
            // 3. AI 실패 시 통계 기반 Rule-based 시뮬레이션으로 즉시 전환
            log.warn("[Simulation Path] AI Analysis failed. Falling back to Rule-based simulation. Error: {}", e.getMessage());
            SimulationDetailResponse ruleResult = runRuleBasedSimulation(input, medicalInflation, estimatedPension);
            log.info("[Simulation Success] Rule-based simulation completed as fallback.");
            return ruleResult;
        }
    }

    private List<String> fetchWelfareServices(String addr) {
        try {
            String apiKey = apiProperties.getPublicData().getApiKey();
            if (isValidKey(apiKey)) {
                log.info("[Bokjiro Request] API Key: {}, Base URL: {}", apiKey.substring(0, 5) + "...", apiProperties.getPublicData().getBaseUrl());
                // 중앙부처 복지서비스 목록조회 (노인 대상)
                PublicDataResponse.WelfareListResponse response = bokjiroClient.getWelfareServices(
                    apiKey, "L", 1, 5, "003", "노인", "006", "json");
                
                if (response != null && response.getWantedList() != null && response.getWantedList().getServList() != null) {
                    log.info("[Bokjiro Success] Count: {}", response.getWantedList().getServList().size());
                    return response.getWantedList().getServList().stream()
                        .map(PublicDataResponse.WelfareService::getServNm)
                        .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            log.warn("[Bokjiro Failed] Error: {}", e.getMessage());
        }
        return Arrays.asList("기초연금", "노인 장기요양 보험");
    }

    private boolean isValidKey(String key) {
        return key != null && !key.contains("YOUR") && !key.contains("${");
    }

    private SimulationDetailResponse runRuleBasedSimulation(AIAnalysisInput input, BigDecimal inflation, BigDecimal pension) {
        // 요양 방식별 월평균 비용 (재가: 60만, 요양원: 180만, 요양병원: 250만)
        BigDecimal careCostBase = switch (input.getCareType()) {
            case HOME -> new BigDecimal("600000");
            case CENTER -> new BigDecimal("1800000");
            case HOSPITAL -> new BigDecimal("2500000");
            default -> new BigDecimal("1000000");
        };

        // 기본 의료비: 노인 1인당 연평균 진료비(600만원) / 12개월 = 월 50만원
        BigDecimal monthlyMedicalBase = SENIOR_MEDICAL_COST_YEAR.divide(new BigDecimal("12"), 0, java.math.RoundingMode.HALF_UP);
        
        // 물가상승률 반영 의료비
        BigDecimal futureMedical = monthlyMedicalBase
            .multiply(BigDecimal.ONE.add(inflation.divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP)));

        // 임금 인상률을 반영한 예상 생활비 (매년 소폭 증가한다고 가정)
        BigDecimal futureLiving = input.getAverageMonthlySpending()
            .multiply(BigDecimal.ONE.add(AVG_WAGE_GROWTH.divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP)));

        SimulationDetailResponse.AgeSegment segment1 = SimulationDetailResponse.AgeSegment.builder()
            .range("70-75세")
            .income(pension.add(new BigDecimal("300000"))) // 연금 + 기초연금 수준 지원금
            .expense(futureLiving.add(futureMedical).add(careCostBase))
            .detail(SimulationDetailResponse.AgeDetail.builder()
                .living(futureLiving)
                .medical(futureMedical)
                .care(careCostBase)
                .build())
            .build();

        return SimulationDetailResponse.builder()
            .incomeDetails(SimulationDetailResponse.IncomeDetails.builder()
                .nationalPension(pension)
                .localSubsidyAmt(new BigDecimal("300000"))
                .totalMonthlyIncome(pension.add(new BigDecimal("300000")))
                .build())
            .ageSegments(Arrays.asList(segment1))
            .aiOpinion("통계 데이터(평균 임금 인상률 2.9%, 노인 평균 진료비 월 50만원)를 기반으로 한 시뮬레이션입니다. " 
                + input.getCareType().getDescription() + " 이용 시 월 약 " + segment1.getExpense().divide(new BigDecimal("10000"), 0, java.math.RoundingMode.HALF_UP) + "만원의 지출이 예상됩니다.")
            .build();
    }
}
