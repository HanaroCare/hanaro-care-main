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

        int remainingYears = Math.max(1, input.getTargetAge() - input.getUserAge());

        BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
            input.getUserId(),
            input.getUserAge(),
            input.getAverageMonthlySpending(),
            remainingYears // 하드코딩된 20 대신 계산된 기간 전달
        );

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
            new BigDecimal("12"), 0, RoundingMode.HALF_UP);

        BigDecimal livingBase = input.getAverageMonthlySpending().compareTo(new BigDecimal("500000")) < 0
            ? new BigDecimal("1500000")
            : input.getAverageMonthlySpending();

        BigDecimal localSubsidy = new BigDecimal("300000");

        // 현재 나이 기준 시작 세그먼트 (5세 단위 내림)
        int startAge = Math.max(65, (input.getUserAge() / 5) * 5);
        int targetAge = input.getTargetAge();

        List<SimulationDetailResponse.AgeSegment> segments = new ArrayList<>();

        for (int segStart = startAge; segStart < targetAge; segStart += 5) {
            int segEnd = Math.min(segStart + 5, targetAge);
            int yearsFromNow = segStart - input.getUserAge();

            // 퇴직연금: 통계 기반 구간별 점진 감소
            // 65-74세: 1,200,000원 (주 수령기), 75-79세: 600,000원 (수령 종료 과도기), 80세+: 0원 (대부분 소진)
            BigDecimal segRetirement;
            if (segStart < 75) {
                segRetirement = new BigDecimal("1200000");
            } else if (segStart < 80) {
                segRetirement = new BigDecimal("600000");
            } else {
                segRetirement = BigDecimal.ZERO;
            }

            BigDecimal segIncome = pension.add(segRetirement).add(localSubsidy);

            BigDecimal livingFactor = BigDecimal.valueOf(Math.pow(1.029, Math.max(0, yearsFromNow)));
            BigDecimal segLiving = livingBase.multiply(livingFactor).setScale(0, RoundingMode.HALF_UP);

            if (segStart >= 80) {
                segLiving = segLiving.multiply(new BigDecimal("0.8")).setScale(0, RoundingMode.HALF_UP);
            }
            BigDecimal medicalFactor = BigDecimal.valueOf(Math.pow(1.045, Math.max(0, yearsFromNow)));
            if (segStart >= 75) medicalFactor = medicalFactor.multiply(new BigDecimal("1.5"));
            BigDecimal segMedical = monthlyMedicalBase.multiply(medicalFactor)
                .multiply(BigDecimal.ONE.add(inflation.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)))
                .setScale(0, RoundingMode.HALF_UP);

            BigDecimal segCare;
            if (segStart < 75) {
                segCare = BigDecimal.ZERO;
            } else if (segStart < 82) {
                segCare = careCostBase.multiply(new BigDecimal("0.5")).setScale(0, RoundingMode.HALF_UP);
            } else {
                // 82세 이상: 본격적인 케어 필요, 선택한 요양비 100% 적용
                segCare = careCostBase;
            }
            BigDecimal segExpense = segLiving.add(segMedical).add(segCare);

            segments.add(SimulationDetailResponse.AgeSegment.builder()
                .range(segStart + "-" + segEnd + "세")
                .income(segIncome)
                .incomeDetail(SimulationDetailResponse.IncomeDetail.builder()
                    .national(pension)
                    .retirement(segRetirement)
                    .subsidy(localSubsidy)
                    .build())
                .expense(segExpense)
                .detail(SimulationDetailResponse.AgeDetail.builder()
                    .living(segLiving)
                    .medical(segMedical)
                    .care(segCare)
                    .build())
                .build());
        }

        if (segments.isEmpty()) {
            BigDecimal defaultRetirement = new BigDecimal("1200000");
            BigDecimal defaultIncome = pension.add(defaultRetirement).add(localSubsidy);
            segments.add(SimulationDetailResponse.AgeSegment.builder()
                .range(startAge + "-" + targetAge + "세")
                .income(defaultIncome)
                .incomeDetail(SimulationDetailResponse.IncomeDetail.builder()
                    .national(pension)
                    .retirement(defaultRetirement)
                    .subsidy(localSubsidy)
                    .build())
                .expense(livingBase.add(monthlyMedicalBase).add(careCostBase))
                .detail(SimulationDetailResponse.AgeDetail.builder()
                    .living(livingBase).medical(monthlyMedicalBase).care(careCostBase)
                    .build())
                .build());
        }

        SimulationDetailResponse.AgeSegment firstSegment = segments.getFirst();
        BigDecimal totalExpense = firstSegment.getExpense();
        // 대표 수입 (초기 구간 기준: 퇴직연금 풀 수령 시점)
        BigDecimal initialRetirement = new BigDecimal("1200000");
        BigDecimal initialTotalIncome = pension.add(initialRetirement).add(localSubsidy);

        return SimulationDetailResponse.builder()
            .incomeDetails(SimulationDetailResponse.IncomeDetails.builder()
                .nationalPension(pension)
                .retirementPension(initialRetirement)
                .localSubsidyAmt(localSubsidy)
                .localSubsidyName("지자체 노인 지원금")
                .totalMonthlyIncome(initialTotalIncome)
                .build())
            .ageSegments(segments)
            .aiOpinion("통계 데이터(평균 임금 인상률 2.9%, 노인 평균 의료비 물가상승률 4.5%)를 기반으로 한 시뮬레이션입니다. "
                + input.getCareType().getDescription() + " 이용 시 첫 구간 월 약 "
                + totalExpense.divide(new BigDecimal("10000"), 0, RoundingMode.HALF_UP)
                + "만원의 지출이 예상됩니다. 퇴직연금은 65~74세 120만원, 75~79세 60만원으로 점진 감소하며 80세 이후 소진됩니다.")
            .build();
    }
}
