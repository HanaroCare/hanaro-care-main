package com.server.asset.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.server.asset.client.BokjiroClient;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.external.PublicDataResponse;
import com.server.asset.dto.simulation.PensionEstimationResult;
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

    private static final BigDecimal AVG_WAGE_GROWTH = new BigDecimal("2.9"); // 2.9%
    private static final BigDecimal SENIOR_MEDICAL_COST_YEAR = new BigDecimal("6000000");
    private static final BigDecimal MEDICAL_INFLATION = new BigDecimal("4.5"); // 4.5%

    public SimulationDetailResponse run(AIAnalysisInput input) {
        // 1. 연금 추정 결과(금액 + 연동여부) 가져오기
        PensionEstimationResult pensionResult = pensionService.estimateMonthlyPension(
            input.getUserId(),
            input.getUserAge(),
            input.getAverageMonthlySpending(),
            20,   // 납부 기간 20년 고정
            false  // 지출 데이터 기반이므로 true
        );

        BigDecimal estimatedPension = pensionResult.getAmount();
        boolean isLinked = pensionResult.isLinked();

        List<String> welfareServices = fetchWelfareServices(input.getUserAddr());

        log.info("[시뮬레이션 시작] 사용자: {}, 나이: {}, 목표나이: {}, 연동여부: {}",
            input.getUserId(), input.getUserAge(), input.getTargetAge(), isLinked);

        try {
            log.info("[시뮬레이션 경로] Gemini AI 분석 시도 중...");
            SimulationDetailResponse aiResult = aiService.analyzeFutureCosts(
                input, MEDICAL_INFLATION, welfareServices, estimatedPension);

            return rebuildWithLinkedStatus(aiResult, isLinked);
        } catch (Exception e) {
            log.warn("[시뮬레이션 경로] AI 분석 실패. 통계 기반 시뮬레이션 전환. 에러: {}", e.getMessage());
            return runRuleBasedSimulation(input, estimatedPension, isLinked);
        }
    }

    private SimulationDetailResponse rebuildWithLinkedStatus(SimulationDetailResponse original, boolean isLinked) {
        return SimulationDetailResponse.builder()
            .incomeDetails(original.getIncomeDetails())
            .ageSegments(original.getAgeSegments())
            .aiOpinion(original.getAiOpinion())
            .isLinked(isLinked)
            .build();
    }

    private SimulationDetailResponse runRuleBasedSimulation(
        AIAnalysisInput input, BigDecimal pension, boolean isLinked) {

        BigDecimal careCostBase = switch (input.getCareType()) {
            case HOME -> new BigDecimal("600000");
            case CENTER -> new BigDecimal("1800000");
            case HOSPITAL -> new BigDecimal("2500000");
            default -> new BigDecimal("1000000");
        };

        BigDecimal monthlyMedicalBase = SENIOR_MEDICAL_COST_YEAR.divide(
            new BigDecimal("12"), 0, RoundingMode.HALF_UP);

        BigDecimal livingBase = input.getAverageMonthlySpending().compareTo(new BigDecimal("500000")) < 0
            ? new BigDecimal("1500000")
            : input.getAverageMonthlySpending();

        BigDecimal localSubsidy = new BigDecimal("300000");

        int currentAge = input.getUserAge();
        int targetAge = Math.max(currentAge + 1, input.getTargetAge());
        int startAge = Math.max(65, (currentAge / 5) * 5);

        List<SimulationDetailResponse.AgeSegment> segments = new ArrayList<>();

        // 복리 계산을 위한 성장률 정의 (1 + r)
        double wageGrowthRate = BigDecimal.ONE.add(AVG_WAGE_GROWTH.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)).doubleValue();
        double medicalGrowthRate = BigDecimal.ONE.add(MEDICAL_INFLATION.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)).doubleValue();

        for (int segStart = startAge; segStart < targetAge; segStart += 5) {
            int segEnd = Math.min(segStart + 5, targetAge);
            if (segStart >= segEnd) break;

            int yearsFromNow = Math.max(0, segStart - currentAge);

            BigDecimal segRetirement = (segStart < 75) ? new BigDecimal("1200000") :
                (segStart < 80) ? new BigDecimal("600000") : BigDecimal.ZERO;
            BigDecimal segIncome = pension.add(segRetirement).add(localSubsidy);

            BigDecimal livingFactor = BigDecimal.valueOf(Math.pow(wageGrowthRate, yearsFromNow));
            BigDecimal segLiving = livingBase.multiply(livingFactor).setScale(0, RoundingMode.HALF_UP);
            if (segStart >= 80) segLiving = segLiving.multiply(new BigDecimal("0.8")).setScale(0, RoundingMode.HALF_UP);

            BigDecimal medicalFactor = BigDecimal.valueOf(Math.pow(medicalGrowthRate, yearsFromNow));
            if (segStart >= 75) medicalFactor = medicalFactor.multiply(new BigDecimal("1.5"));
            BigDecimal segMedical = monthlyMedicalBase.multiply(medicalFactor).setScale(0, RoundingMode.HALF_UP);

            BigDecimal segCare = (segStart < 75) ? BigDecimal.ZERO :
                (segStart < 82) ? careCostBase.multiply(new BigDecimal("0.5")).setScale(0, RoundingMode.HALF_UP) :
                    careCostBase;

            BigDecimal segExpense = segLiving.add(segMedical).add(segCare);

            segments.add(SimulationDetailResponse.AgeSegment.builder()
                .range(segStart + "-" + segEnd + "세")
                .income(segIncome)
                .incomeDetail(SimulationDetailResponse.IncomeDetail.builder()
                    .national(pension).retirement(segRetirement).subsidy(localSubsidy).build())
                .expense(segExpense)
                .detail(SimulationDetailResponse.AgeDetail.builder()
                    .living(segLiving).medical(segMedical).care(segCare).build())
                .build());
        }

        // 폴백 세그먼트 (루프 미실행 시)
        if (segments.isEmpty()) {
            segments.add(SimulationDetailResponse.AgeSegment.builder()
                .range(startAge + "-" + targetAge + "세")
                .income(pension.add(new BigDecimal("1200000")).add(localSubsidy))
                .expense(livingBase.add(monthlyMedicalBase).add(careCostBase))
                .detail(SimulationDetailResponse.AgeDetail.builder().living(livingBase).medical(monthlyMedicalBase).care(careCostBase).build())
                .build());
        }

        SimulationDetailResponse.AgeSegment firstSegment = segments.get(0);
        BigDecimal actualFirstRetirement = firstSegment.getIncomeDetail().getRetirement();
        BigDecimal actualFirstTotalIncome = firstSegment.getIncome();
        BigDecimal firstSegExpense = firstSegment.getExpense();

        return SimulationDetailResponse.builder()
            .incomeDetails(SimulationDetailResponse.IncomeDetails.builder()
                .nationalPension(pension)
                .retirementPension(actualFirstRetirement) // 하드코딩 제거
                .localSubsidyAmt(localSubsidy)
                .localSubsidyName("지자체 노인 지원금")
                .totalMonthlyIncome(actualFirstTotalIncome) // 하드코딩 제거
                .build())
            .ageSegments(segments)
            .aiOpinion("통계 데이터(임금 상승률 " + AVG_WAGE_GROWTH + "%, 의료 물가 " + MEDICAL_INFLATION + "%) 기반 분석 결과입니다. "
                + input.getCareType().getDescription() + " 이용 시 첫 구간 월 약 "
                + firstSegExpense.divide(new BigDecimal("10000"), 0, RoundingMode.HALF_UP) + "만원이 예상됩니다.")
            .isLinked(isLinked)
            .build();
    }

    private List<String> fetchWelfareServices(String userAddr) {
        try {
            String region = extractRegion(userAddr);
            String searchWrd = region.isBlank() ? "노인" : region + " 노인";
            PublicDataResponse.WelfareListResponse response = bokjiroClient.getWelfareServices("003", searchWrd, "006", 1, 5);
            if (response != null && response.getWantedList() != null && response.getWantedList().getServList() != null) {
                return response.getWantedList().getServList().stream()
                    .map(PublicDataResponse.WelfareService::getServNm).collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("[복지로 조회 실패] {}", e.getMessage());
        }
        return Arrays.asList("기초연금", "노인 장기요양 보험");
    }

    private String extractRegion(String addr) {
        if (addr == null || addr.isBlank()) return "";
        String[] parts = addr.split(" ");
        return parts.length > 0 ? parts[0] : "";
    }
}
