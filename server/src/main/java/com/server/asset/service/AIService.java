package com.server.asset.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.client.OpenAiClient;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    private final OpenAiClient openAiClient;
    private final ObjectMapper objectMapper;

    @Cacheable(
        cacheNames = "gemini",
        key = "#input.userId + ':' + #input.userAge + ':' + #input.targetAge + ':' + "
            + "#input.careType.name() + ':' + #input.userAddr + ':' + "
            + "#input.averageMonthlySpending + ':' + #input.totalAssetAmt + ':' + "
            + "#input.spendingByCategory",
        unless = "#result == null"
    )
    public SimulationDetailResponse analyzeFutureCosts(
        AIAnalysisInput input,
        BigDecimal medicalInflation,
        List<String> welfareServices,
        BigDecimal estimatedPension
    ) {
        String prompt = buildAdvancedPrompt(input, medicalInflation, welfareServices, estimatedPension);

        try {
            String rawText = null;
            int maxRetries = 3;

            for (int retryCount = 0; retryCount < maxRetries; retryCount++) {
                try {
                    rawText = openAiClient.chat(prompt);
                    break;
                } catch (RestClientResponseException ex) {
                    if (ex.getStatusCode().value() == 429 && retryCount < maxRetries - 1) {
                        log.warn("[OpenAI] 할당량 초과(429). 재시도 중... ({}/{})", retryCount + 1, maxRetries);
                        Thread.sleep(2000L * (retryCount + 1));
                    } else {
                        throw ex;
                    }
                }
            }

            if (rawText == null) {
                throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
            }
            String jsonOnly = extractPureJson(rawText);

            SimulationDetailResponse detailResponse = objectMapper.readValue(jsonOnly, SimulationDetailResponse.class);

            validateSimulationResponse(detailResponse);

            return detailResponse;

        } catch (Exception e) {
            log.error("[OpenAI] AI 분석 실패. 에러: {}", e.getMessage());
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }
    }

    private String extractPureJson(String text) {
        // 1. Markdown JSON 블록 탐색 (```json ... ```)
        Pattern pattern = Pattern.compile("(?s)```(?:json)?\\s*(.*?)\\s*```");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        // 2. 블록이 없으면 첫 번째 '{'와 마지막 '}' 사이의 내용 추출
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start != -1 && end != -1 && start < end) {
            return text.substring(start, end + 1).trim();
        }

        return text.trim();
    }

    private String buildAdvancedPrompt(
        AIAnalysisInput input,
        BigDecimal medicalInflation,
        List<String> welfareServices,
        BigDecimal estimatedPension
    ) {
        String welfareContext = String.join(", ", welfareServices);

        return String.format("""
            사용자의 실데이터와 공공 통계(임금 인상률 2.9%%, 노인 평균 의료비 등)를 기반으로 정밀한 노후 자금 시뮬레이션을 수행해줘.

            [1. 핵심 입력 데이터]
            - 현재 나이: %d세 / 목표 준비 나이: %d세
            - 거주지: %s / 자산 총액: %s원
            - 월평균 소비: %s원 (이 소비액은 매년 임금 인상률 2.9%%만큼 증가한다고 가정해)
            - 선택한 요양 방식: %s
            - 예상 월 국민연금 수령액: %s원

            [2. 외부 통계 데이터]
            - 최근 보건 의료비 물가상승률: 연 %s%% (이를 반영하여 미래 의료비를 계산할 것)
            - 대한민국 평균 임금 인상률: 연 2.9%% (생활비 상승에 반영)
            - 거주지 기반 주요 복지 혜택: [%s]

            [3. 시뮬레이션 지침]
            - 핵심 1 (물가 반영): 모든 비용(생활비, 의료비)에는 제시된 물가상승률을 복리로 적용해.
            - 핵심 2 (비중 변화): 70대 초반까지는 활동적인 생활을 반영해 '생활비' 비중을 높게 잡고, 80대 이후부터는 활동량 감소로 생활비는 줄이되 '의료비'와 '요양비' 비중을 기하급수적으로 높여서 현실적인 노후 지출 곡선을 만들어줘.
            - 핵심 3 (요양비): 선택한 요양 방식(%s)에 따른 평균 비용을 반영하되, 건강 상태를 고려해 연령대가 높아질수록 점진적으로 증액해.
            - 핵심 4 (기간): 결과는 5년 단위 세그먼트로 나누되, 각 세그먼트의 income/expense는 해당 기간의 '월 평균'으로 작성해.
            - 핵심 5 (구간별 수입 변화): 퇴직연금(retirement)은 아래 통계 기반 모델로 구간별 다르게 적용해.
              * 65-74세: 약 1,200,000원 (주 수령기)
              * 75-79세: 약 600,000원 (수령 종료 과도기, 통계 평균 약 50% 잔존)
              * 80세 이상: 0원 (대부분 소진)
              국민연금(national)은 수령 개시 후 전 구간 동일 적용, 지자체 지원금(subsidy)은 65세 이상 전 구간 동일 적용.

            [4. 출력 형식]
            - 반드시 JSON 형식만 출력하고 다른 설명은 제외해.

            {
              "income_details": {
                "national_pension": %s,
                "retirement_pension": 숫자,
                "local_subsidy_amt": 숫자,
                "local_subsidy_name": "거주지 기반 지원금 명칭",
                "total_monthly_income": 숫자
              },
              "age_segments": [
                {
                  "range": "연령대",
                  "income": 숫자,
                  "income_detail": {
                    "national": 숫자,
                    "retirement": 숫자,
                    "subsidy": 숫자
                  },
                  "expense": 숫자,
                  "detail": { "living": 숫자, "medical": 숫자, "care": 숫자 }
                }
              ],
              "ai_opinion": "통계와 사용자 데이터를 종합한 노후 준비 전략 2문장 내외"
            }
            """,
            input.getUserAge(), input.getTargetAge(), input.getUserAddr(), input.getTotalAssetAmt(),
            input.getAverageMonthlySpending(), input.getCareType().getDescription(),
            estimatedPension, medicalInflation, welfareContext, medicalInflation,
            input.getCareType().getDescription(), estimatedPension, estimatedPension);
    }

    private void validateSimulationResponse(SimulationDetailResponse response) {
        if (response == null) {
            throw new IllegalStateException("AI 응답 객체가 생성되지 않았습니다.");
        }

        // 1. 소득 상세 정보 검증
        if (response.getIncomeDetails() == null) {
            throw new IllegalArgumentException("필수 필드 누락: income_details가 없습니다.");
        }

        // 2. 연령대별 시뮬레이션 데이터 검증
        if (response.getAgeSegments() == null || response.getAgeSegments().isEmpty()) {
            throw new IllegalArgumentException("필수 필드 누락: age_segments가 비어있거나 없습니다.");
        }

        // 3. 첫 번째 세그먼트의 상세 데이터 존재 여부 검증
        SimulationDetailResponse.AgeSegment firstSegment = response.getAgeSegments().get(0);
        if (firstSegment.getDetail() == null) {
            throw new IllegalArgumentException("필수 필드 누락: age_segments 내의 상세 비용(detail) 정보가 없습니다.");
        }

        // 4. AI 의견 존재 여부 검증
        if (response.getAiOpinion() == null || response.getAiOpinion().isBlank()) {
            throw new IllegalArgumentException("필수 필드 누락: ai_opinion이 없습니다.");
        }

        log.info("[OpenAI] AI 응답 데이터 검증 성공");
    }
}
