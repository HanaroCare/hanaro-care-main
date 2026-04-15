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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationEngine {

    private final AIService aiService;
    private final NationalPensionService pensionService;
    private final BokjiroClient bokjiroClient;

    private static final BigDecimal AVG_WAGE_GROWTH = new BigDecimal("2.9");
    private static final BigDecimal SENIOR_MEDICAL_COST_YEAR = new BigDecimal("6000000");
    private static final BigDecimal MEDICAL_INFLATION = new BigDecimal("4.5");

    public SimulationDetailResponse run(AIAnalysisInput input) {
        BigDecimal medicalInflation = MEDICAL_INFLATION;

        BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
            input.getUserId(),
            input.getUserAge(),
            input.getAverageMonthlySpending(),
            20
        );

        // 주소 기반 복지 서비스 조회
        List<String> welfareServices = fetchWelfareServices(input.getUserAddr());

        log.info("[시뮬레이션 시작] 사용자 나이: {}, 목표 나이: {}, 요양 유형: {}",
            input.getUserAge(), input.getTargetAge(), input.getCareType());
        log.info("[시뮬레이션 지표] 의료비 상승률: {}%, 평균 임금 인상률: {}%, 복지 서비스 수: {}",
            medicalInflation, AVG_WAGE_GROWTH, welfareServices.size());

        try {
            log.info("[시뮬레이션 경로] Gemini AI 분석 시도 중...");
            SimulationDetailResponse aiResult = aiService.analyzeFutureCosts(
                input, medicalInflation, welfareServices, estimatedPension);
            log.info("[시뮬레이션 성공] AI 분석 완료.");
            return aiResult;
        } catch (Exception e) {
            log.warn("[시뮬레이션 경로] AI 분석 실패. 통계 기반 시뮬레이션으로 전환합니다. 에러: {}",
                e.getMessage());
            SimulationDetailResponse ruleResult = runRuleBasedSimulation(
                input, medicalInflation, estimatedPension);
            log.info("[시뮬레이션 성공] 통계 기반 시뮬레이션 완료.");
            return ruleResult;
        }
    }

    private List<String> fetchWelfareServices(String userAddr) {
        try {
            String region = extractRegion(userAddr);
            String searchWrd = region.isBlank() ? "노인" : region + " 노인";
            log.info("[복지로 조회] 검색어: {}", searchWrd);

            PublicDataResponse.WelfareListResponse response =
                bokjiroClient.getWelfareServices("003", searchWrd, "006", 1, 5);

            if (response != null
                && response.getWantedList() != null
                && response.getWantedList().getServList() != null) {

                log.info("[복지로 조회 성공] 복지 서비스 수: {}",
                    response.getWantedList().getServList().size());

                return response.getWantedList().getServList().stream()
                    .map(PublicDataResponse.WelfareService::getServNm)
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("[복지로 조회 실패] 에러: {}", e.getMessage());
        }
        return Arrays.asList("기초연금", "노인 장기요양 보험");
    }

    private String extractRegion(String addr) {
        if (addr == null || addr.isBlank()) return "";
        String[] parts = addr.split(" ");
        return parts.length > 0 ? parts[0] : "";
    }

    private SimulationDetailResponse runRuleBasedSimulation(
        AIAnalysisInput input, BigDecimal inflation, BigDecimal pension) {

        BigDecimal careCostBase = switch (input.getCareType()) {
            case HOME -> new BigDecimal("600000");
            case CENTER -> new BigDecimal("1800000");
            case HOSPITAL -> new BigDecimal("2500000");
            default -> new BigDecimal("1000000");
        };

        BigDecimal monthlyMedicalBase = SENIOR_MEDICAL_COST_YEAR.divide(
            new BigDecimal("12"), 0, java.math.RoundingMode.HALF_UP);

        BigDecimal futureMedical = monthlyMedicalBase.multiply(
            BigDecimal.ONE.add(
                inflation.divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP)));

        BigDecimal futureLiving = input.getAverageMonthlySpending().multiply(
            BigDecimal.ONE.add(
                AVG_WAGE_GROWTH.divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP)));

        SimulationDetailResponse.AgeSegment segment1 = SimulationDetailResponse.AgeSegment.builder()
            .range("70-75세")
            .income(pension.add(new BigDecimal("300000")))
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
                + input.getCareType().getDescription() + " 이용 시 월 약 "
                + segment1.getExpense().divide(new BigDecimal("10000"), 0, java.math.RoundingMode.HALF_UP)
                + "만원의 지출이 예상됩니다.")
            .build();
    }
}
