package com.server.asset.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import com.server.asset.client.BokjiroClient;
import com.server.asset.client.KosisClient;
import com.server.asset.dto.external.AIAnalysisInput;
import com.server.asset.dto.external.PublicDataResponse;
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

    /**
     * 모든 데이터 소스를 조합하여 최종 AI 시뮬레이션 결과 산출
     */
    public SimulationDetailResponse run(AIAnalysisInput input) {
        
        // 1. 외부 통계 데이터 수집 (의료 물가 상승률)
        BigDecimal medicalInflation = fetchMedicalInflation();

        // 2. 지자체 지원금 및 복지 서비스 수집
        List<String> welfareServices = fetchWelfareServices(input.getUserAddr());

        // 3. 예상 국민연금 산출 (총 가입기간 20년 가정)
        BigDecimal estimatedPension = pensionService.estimateMonthlyPension(
            input.getUserAge(), input.getAverageMonthlySpending(), 20);

        // 4. AI 엔진 호출하여 최종 리포트 생성
        return aiService.analyzeFutureCosts(input, medicalInflation, welfareServices, estimatedPension);
    }

    private BigDecimal fetchMedicalInflation() {
        try {
            List<PublicDataResponse.KosisData> data = kosisClient.getMedicalInflation(
                apiProperties.getKosis().getApiKey(), "getList", "json", "101", "Y", "2023", "2023");
            
            if (data != null && !data.isEmpty()) {
                // 통계청 데이터에서 수치 추출 (예: 4.5)
                return new BigDecimal(data.getFirst().getValue());
            }
        } catch (Exception e) {
            log.warn("KOSIS API failed, using default inflation rate: {}", e.getMessage());
        }
        return new BigDecimal("5.0"); // Fallback
    }

    private List<String> fetchWelfareServices(String addr) {
        try {
            // 주소에서 시/도 추출하여 검색 (예: '서울')
            String region = addr.split(" ")[0];
            String rawResponse = bokjiroClient.getWelfareServices(
                apiProperties.getPublicData().getApiKey(), 1, 5, region + " 노인", "006");
            
            // 실제 구현에서는 XML/JSON 파싱이 필요하지만, 여기서는 핵심 키워드 추출 위주로 시뮬레이션
            if (rawResponse.contains("기초연금")) return Arrays.asList("기초연금", "노인 일자리 지원", "고령자 의료비 지원");
        } catch (Exception e) {
            log.warn("Bokjiro API failed, using default welfare info: {}", e.getMessage());
        }
        return Arrays.asList("기초연금", "노인 장기요양 보험"); // Fallback
    }
}
