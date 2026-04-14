package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.client.GeminiClient;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.external.GeminiRequest;
import com.server.asset.dto.external.GeminiResponse;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.common.config.external.ExternalApiProperties;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;
    private final ExternalApiProperties externalApiProperties;

    /**
     * Gemini LLM을 통해 미래 비용 및 노후 소비 패턴 분석 (통계 데이터 반영)
     */
    public SimulationDetailResponse analyzeFutureCosts(AIAnalysisInput input,
                                                     BigDecimal medicalInflation, 
                                                     List<String> welfareServices, 
                                                     BigDecimal estimatedPension) {
        
        String prompt = buildAdvancedPrompt(input, medicalInflation, welfareServices, estimatedPension);

        GeminiRequest.RequestBody requestBody = GeminiRequest.RequestBody.builder()
            .contents(Collections.singletonList(
                GeminiRequest.Content.builder()
                    .parts(Collections.singletonList(
                        GeminiRequest.Part.builder().text(prompt).build()
                    ))
                    .build()
            ))
            .build();

        try {
            GeminiResponse response = geminiClient.generateContent(
                externalApiProperties.getGemini().getApiKey(), requestBody);
            String aiJsonText = extractJsonFromText(response.getText());
            return objectMapper.readValue(aiJsonText, SimulationDetailResponse.class);
        } catch (Exception e) {
            log.error("AI Analysis failed: {}", e.getMessage());
            throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);
        }
    }

    private String buildAdvancedPrompt(AIAnalysisInput input, BigDecimal medicalInflation,
                                      List<String> welfareServices, BigDecimal estimatedPension) {
        String welfareContext = String.join(", ", welfareServices);
        
        return String.format("""
            사용자의 실데이터와 공공 통계를 기반으로 정밀한 노후 자금 시뮬레이션을 수행해줘.
            
            [1. 사용자 실데이터]
            - 현재 나이: %d세 / 목표 준비 나이: %d세
            - 거주지: %s / 자산 총액: %s원
            - 월평균 소비: %s원 (상세: %s)
            - 선택한 요양 방식: %s
            - 예상 월 국민연금: %s원
            
            [2. 외부 통계 및 혜택 컨텍스트]
            - 최근 보건 의료비 물가상승률 통계치: 연 %s%% (이 수치를 의료비 계산에 반영할 것)
            - 거주지 기반 주요 복지 혜택: [%s]
            
            [3. 시뮬레이션 지침]
            - 일반 물가상승률은 연 3%%를 적용하되, 의료비는 통계치(%s%%)를 우선 반영해줘.
            - 5년 단위로 수입(국민연금+지원금)과 지출(생활비+의료비+요양비)을 시뮬레이션해.
            - 요양 방식(%s)에 따른 비용 급증 시점(보통 75세~80세 이후)을 명확히 반영해.
            - 지자체 지원금은 'income_details'의 'local_subsidy_amt'에 평균치를 반영해.
            
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
                  "expense": 숫자,
                  "detail": { "living": 숫자, "medical": 숫자, "care": 숫자 }
                }
              ],
              "ai_opinion": "통계와 사용자 데이터를 종합한 노후 준비 전략 2문장 내외"
            }
            """, 
            input.getUserAge(), input.getTargetAge(), input.getUserAddr(), input.getTotalAssetAmt(),
            input.getAverageMonthlySpending(), input.getSpendingByCategory(), input.getCareType().getDescription(),
            estimatedPension, medicalInflation, welfareContext, medicalInflation, 
            input.getCareType().getDescription(), estimatedPension);
    }

    private String extractJsonFromText(String text) {
        if (text.contains("```json")) {
            return text.substring(text.indexOf("```json") + 7, text.lastIndexOf("```")).trim();
        } else if (text.contains("```")) {
            return text.substring(text.indexOf("```") + 3, text.lastIndexOf("```")).trim();
        }
        return text.trim();
    }
}
