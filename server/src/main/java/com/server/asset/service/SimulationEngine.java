package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.server.asset.client.BokjiroClient;
import com.server.asset.client.KosisClient;
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
    private final KosisClient kosisClient;
    private final BokjiroClient bokjiroClient;
    private final ExternalApiProperties apiProperties;

    public SimulationDetailResponse run(AIAnalysisInput input) {
        // 1. 핵심 지표 산출
        BigDecimal medicalInflation = fetchMedicalInflation();
        BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
            input.getUserAge(), input.getAverageMonthlySpending(), 20);
        List<String> welfareServices = fetchWelfareServices(input.getUserAddr());

        log.info("[Simulation Start] User Age: {}, Target Age: {}, Care Type: {}", 
            input.getUserAge(), input.getTargetAge(), input.getCareType());
        log.info("[Simulation Metrics] Medical Inflation: {}%, Estimated Pension: {} KRW, Welfare Services Count: {}", 
            medicalInflation, estimatedPension, welfareServices.size());

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

    private BigDecimal fetchMedicalInflation() {
        try {
            String apiKey = apiProperties.getKosis().getApiKey();
            if (isValidKey(apiKey)) {
                log.info("[KOSIS Request] API Key: {}, Base URL: {}", apiKey.substring(0, 5) + "...", apiProperties.getKosis().getBaseUrl());
                List<PublicDataResponse.KosisData> data = kosisClient.getMedicalInflation(
                    apiKey, "getList", "json", "101", "Y", "2023", "2023");
                if (data != null && !data.isEmpty()) {
                    log.info("[KOSIS Success] Value: {}", data.get(0).getValue());
                    return new BigDecimal(data.get(0).getValue());
                }
            }
        } catch (Exception e) {
            log.warn("[KOSIS Failed] Error: {}", e.getMessage());
        }
        return new BigDecimal("4.5");
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

        // 70세 기준 시뮬레이션 (현재 소비 + 의료물가상승 반영 의료비 + 요양비)
        // 기본 의료비를 월 30만원으로 가정하고 물가상승률 적용
        BigDecimal futureMedical = new BigDecimal("300000")
            .multiply(BigDecimal.ONE.add(inflation.divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP)));

        SimulationDetailResponse.AgeSegment segment1 = SimulationDetailResponse.AgeSegment.builder()
            .range("70-75세")
            .income(pension.add(new BigDecimal("300000")))
            .expense(input.getAverageMonthlySpending().add(futureMedical).add(careCostBase))
            .detail(SimulationDetailResponse.AgeDetail.builder()
                .living(input.getAverageMonthlySpending())
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
            .aiOpinion("현재 통계 기반 시뮬레이션 결과입니다. " + input.getCareType().getDescription() + " 중심의 노후 자금 준비가 필요합니다.")
            .build();
    }
}
