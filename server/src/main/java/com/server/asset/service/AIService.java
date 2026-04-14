package com.server.asset.service;

import java.util.Collections;

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

    public SimulationDetailResponse analyzeFutureCosts(AIAnalysisInput input) {
        String prompt = buildPrompt(input);

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

    private String buildPrompt(AIAnalysisInput input) {
        return String.format("""
            사용자의 데이터를 기반으로 노후 생활비 및 의료비를 시뮬레이션해줘.
            
            [사용자 정보]
            - 현재 나이: %d세
            - 목표 준비 나이: %d세
            - 거주지: %s
            - 월평균 소비액: %s원
            - 요양 방식: %s
            - 자산 총액: %s원
            
            [분석 요청 사항]
            1. 현재 소비 패턴과 물가 상승률(연 3%%), 의료비 인플레이션(연 5%%)을 반영하여 5년 단위로 수입/지출을 계산해줘.
            2. %s 요양 방식에 따른 예상 비용을 75세 이후부터 집중 반영해줘.
            3. 지자체(%s) 지원금 혜택을 수입 항목에 포함해줘.
            4. 결과는 반드시 아래 JSON 형식을 엄격히 지켜서 응답해줘. 텍스트 설명 없이 JSON만 출력해.
            
            [JSON 응답 형식]
            {
              "income_details": {
                "national_pension": 숫자,
                "retirement_pension": 숫자,
                "local_subsidy_amt": 숫자,
                "local_subsidy_name": "문자열",
                "total_monthly_income": 숫자
              },
              "age_segments": [
                {
                  "range": "65-70세",
                  "income": 숫자,
                  "expense": 숫자,
                  "detail": { "living": 숫자, "medical": 숫자, "care": 숫자 }
                }
              ],
              "ai_opinion": "문자열 (향후 자금 준비에 대한 AI의 짧은 조언)"
            }
            """, 
            input.getUserAge(), input.getTargetAge(), input.getUserAddr(), 
            input.getAverageMonthlySpending(), input.getCareType().getDescription(), 
            input.getTotalAssetAmt(), input.getCareType().getDescription(), input.getUserAddr());
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
