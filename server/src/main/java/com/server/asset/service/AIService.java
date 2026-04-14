package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
            GeminiResponse response = null;
            int maxRetries = 3;
            int retryCount = 0;
            
            while (retryCount < maxRetries) {
                try {
                    response = geminiClient.generateContent(
                        externalApiProperties.getGemini().getApiKey(), requestBody);
                    break;
                } catch (Exception e) {
                    if (e.getMessage().contains("429") && retryCount < maxRetries - 1) {
                        retryCount++;
                        log.warn("Gemini Rate limit (429) hit. Retrying... ({} / {})", retryCount, maxRetries);
                        Thread.sleep(2000 * retryCount); // Exponential backoff
                        continue;
                    }
                    throw e;
                }
            }
            
            if (response == null) throw new ApiException(ErrorStatus.SIMULATION_JSON_ERROR);

            String rawText = response.getText();
            String jsonOnly = extractPureJson(rawText);
            
            log.info("AI Response (Cleaned): {}", jsonOnly);
            return objectMapper.readValue(jsonOnly, SimulationDetailResponse.class);
        } catch (Exception e) {
            log.error("AI Analysis failed. Error: {}", e.getMessage());
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

    private String buildAdvancedPrompt(AIAnalysisInput input, BigDecimal medicalInflation, 
                                      List<String> welfareServices, BigDecimal estimatedPension) {
        String welfareContext = String.join(", ", welfareServices);
        
        return String.format("""
            사용자의 실데이터와 공공 통계를 기반으로 정밀한 노후 자금 시뮬레이션을 수행해줘.
            
            [1. 핵심 입력 데이터]
            - 현재 나이: %d세 / 목표 준비 나이: %d세
            - 거주지: %s / 자산 총액: %s원
            - 월평균 소비: %s원
            - 선택한 요양 방식: %s
            - 예상 월 국민연금 수령액: %s원
            
            [2. 외부 통계 데이터]
            - 최근 보건 의료비 물가상승률: 연 %s%% (이를 반영하여 미래 의료비를 계산할 것)
            - 거주지 기반 주요 복지 혜택: [%s]
            
            [3. 시뮬레이션 지침]
            - 핵심 1 (의료비): 현재 의료비(월 약 30만원 가정)에 의료비 물가상승률(%s%%)을 누적으로 적용해.
            - 핵심 2 (요양비): 선택한 요양 방식(%s)에 따른 평균 비용을 반영해. (재가: 약 60~100만, 시설: 약 150~250만, 실버타운: 300만 이상)
            - 핵심 3 (소득): 국민연금(%s원)을 기본 소득으로 잡고, 복지 혜택에 따른 추가 지원금을 추정해.
            - 결과는 반드시 5년 단위(예: 70-75세, 75-80세 등)로 구성해.
            
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
            input.getAverageMonthlySpending(), input.getCareType().getDescription(),
            estimatedPension, medicalInflation, welfareContext, medicalInflation, 
            input.getCareType().getDescription(), estimatedPension, estimatedPension);
    }
}
