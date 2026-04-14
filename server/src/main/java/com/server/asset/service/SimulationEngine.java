package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.springframework.stereotype.Component;

import com.server.asset.client.BokjiroClient;
import com.server.asset.client.KosisClient;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.external.PublicDataResponse;
import com.server.asset.dto.simulation.SimulationDetailResponse;
import com.server.common.config.external.ExternalApiProperties;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;

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
        try {
            // 1. 외부 데이터 병렬 수집 시작
            CompletableFuture<BigDecimal> inflationFuture = CompletableFuture.supplyAsync(this::fetchMedicalInflation);
            CompletableFuture<List<String>> welfareFuture = CompletableFuture.supplyAsync(() -> fetchWelfareServices(input.getUserAddr()));

            // 2. 내부 연금 시뮬레이션
            BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
                input.getUserAge(), input.getAverageMonthlySpending(), 20);

            // 3. 결과 대기 및 에러 핸들링
            BigDecimal medicalInflation = inflationFuture.join();
            List<String> welfareServices = welfareFuture.join();

            // 4. 최종 AI 분석 요청
            return aiService.analyzeFutureCosts(input, medicalInflation, welfareServices, estimatedPension);

        } catch (CompletionException e) {
            log.error("Simulation Engine failed due to async task error: {}", e.getMessage());
            if (e.getCause() instanceof ApiException apiException) {
                throw apiException;
            }
            throw new ApiException(ErrorStatus.EXTERNAL_API_ERROR);
        }
    }

    private BigDecimal fetchMedicalInflation() {
        String apiKey = apiProperties.getKosis().getApiKey();
        
        // API 키가 설정되지 않았거나 기본값인 경우 Fallback 데이터 사용
        if (apiKey == null || apiKey.contains("YOUR_KOSIS_KEY") || apiKey.contains("${")) {
            log.warn("KOSIS API Key is missing. Using default inflation rate (4.5%)");
            return new BigDecimal("4.5");
        }

        try {
            List<PublicDataResponse.KosisData> data = kosisClient.getMedicalInflation(
                apiKey, "getList", "json", "101", "Y", "2023", "2023");
            
            if (data == null || data.isEmpty()) {
                throw new ApiException(ErrorStatus.EXTERNAL_API_BAD_REQUEST);
            }
            return new BigDecimal(data.getFirst().getValue());
        } catch (Exception e) {
            log.error("KOSIS API call failed: {}. Falling back to 4.5%", e.getMessage());
            return new BigDecimal("4.5"); // 통계 데이터는 시뮬레이션 중단보다 기본값 사용이 나음
        }
    }

    private List<String> fetchWelfareServices(String addr) {
        String apiKey = apiProperties.getPublicData().getApiKey();

        if (apiKey == null || apiKey.contains("YOUR_PUBLIC_KEY") || apiKey.contains("${")) {
            log.warn("Public Data API Key is missing. Using default welfare services.");
            return Arrays.asList("기초연금", "노인 장기요양 보험");
        }

        try {
            String region = addr.split(" ")[0];
            String rawResponse = bokjiroClient.getWelfareServices(apiKey, 1, 5, region + " 노인", "006");
            
            if (rawResponse == null || rawResponse.contains("err")) {
                throw new ApiException(ErrorStatus.EXTERNAL_API_BAD_REQUEST);
            }
            return Arrays.asList("기초연금", "노인 장기요양 보험", region + " 노인 일자리 사업");
        } catch (Exception e) {
            log.error("Bokjiro API call failed: {}. Using default services.", e.getMessage());
            return Arrays.asList("기초연금", "노인 장기요양 보험");
        }
    }
}
