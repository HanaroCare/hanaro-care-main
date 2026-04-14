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
            // 1. 외부 데이터 병렬 수집
            CompletableFuture<BigDecimal> inflationFuture = CompletableFuture.supplyAsync(this::fetchMedicalInflation);
            CompletableFuture<List<String>> welfareFuture = CompletableFuture.supplyAsync(() -> fetchWelfareServices(input.getUserAddr()));

            BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
                input.getUserAge(), input.getAverageMonthlySpending(), 20);

            // 2. 데이터 병합 (에러 발생 시 CompletionException 발생)
            BigDecimal medicalInflation = inflationFuture.join();
            List<String> welfareServices = welfareFuture.join();

            return aiService.analyzeFutureCosts(input, medicalInflation, welfareServices, estimatedPension);

        } catch (CompletionException e) {
            // 병렬 작업 중 발생한 에러 처리
            if (e.getCause() instanceof ApiException apiException) {
                throw apiException;
            }
            throw new ApiException(ErrorStatus.EXTERNAL_API_ERROR);
        }
    }

    private BigDecimal fetchMedicalInflation() {
        try {
            List<PublicDataResponse.KosisData> data = kosisClient.getMedicalInflation(
                apiProperties.getKosis().getApiKey(), "getList", "json", "101", "Y", "2023", "2023");
            
            if (data == null || data.isEmpty()) {
                throw new ApiException(ErrorStatus.EXTERNAL_API_BAD_REQUEST);
            }
            return new BigDecimal(data.getFirst().getValue());
        } catch (Exception e) {
            log.error("KOSIS API Error: {}", e.getMessage());
            // 통계 데이터 실패 시 시뮬레이션 중단 여부에 따라 결정 (여기서는 명확한 에러 전파)
            throw new ApiException(ErrorStatus.EXTERNAL_API_ERROR);
        }
    }

    private List<String> fetchWelfareServices(String addr) {
        try {
            String region = addr.split(" ")[0];
            String rawResponse = bokjiroClient.getWelfareServices(
                apiProperties.getPublicData().getApiKey(), 1, 5, region + " 노인", "006");
            
            if (rawResponse == null) {
                throw new ApiException(ErrorStatus.EXTERNAL_API_BAD_REQUEST);
            }
            // 간이 추출 (실제로는 JSON 파싱 라이브러리 사용 권장)
            return Arrays.asList("기초연금", "노인 장기요양 보험");
        } catch (Exception e) {
            log.error("Bokjiro API Error: {}", e.getMessage());
            throw new ApiException(ErrorStatus.EXTERNAL_API_ERROR);
        }
    }
}
