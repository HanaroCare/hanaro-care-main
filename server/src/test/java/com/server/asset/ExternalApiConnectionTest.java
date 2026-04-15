package com.server.asset;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.Collections;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.server.asset.client.BokjiroClient;
import com.server.asset.client.GeminiClient;
import com.server.asset.dto.external.GeminiRequest;
import com.server.asset.dto.external.GeminiResponse;
import com.server.asset.dto.external.publicdata.PublicDataResponse;
import com.server.common.config.external.ExternalApiProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
public class ExternalApiConnectionTest {

    @Autowired private BokjiroClient bokjiroClient;
    @Autowired private GeminiClient geminiClient;
    @Autowired private ExternalApiProperties apiProperties;

    @Test
    @DisplayName("복지로 API 연결 테스트")
    public void testBokjiroConnection() {
        String apiKey = apiProperties.getPublicData().getApiKey();
        log.info("### [복지로] 호출 시작 - Key 상태: {}", apiKey != null ? "정상 로드됨" : "null");
        
        try {
            // 1. 목록 조회 시도
            log.info("### [복지로] 1. 목록 조회 시도...");
            PublicDataResponse.WelfareListResponse response = bokjiroClient.getWelfareServices(
                apiKey, "L", 1, 5, "003", "노인", null, "json");
            
            if (response != null && response.getWantedList() != null) {
                log.info("### [복지로] 목록 조회 성공! 데이터 수: {}", response.getWantedList().getTotalCount());
            }

            // 2. 상세 조회 시도 (사용자 제안 엔드포인트 검증용 샘플 ID 사용)
            log.info("### [복지로] 2. 상세 조회 시도 (ID: WLF00001138)...");
            String detailJson = bokjiroClient.getWelfareDetail(apiKey, "D", "WLF00001138");
            log.info("### [복지로] 상세 조회 응답 수신 성공!");
            
        } catch (Exception e) {
            log.error("### [복지로] 연결 실패! 에러: {}", e.getMessage());
            if (e.getMessage().contains("403")) {
                log.error("### [복지로] 가이드: 공공데이터포털 마이페이지에서 '일반 인증키(Decoding)'를 사용중인지 확인해주세요.");
            }
        }
    }

    @Test
    @DisplayName("Gemini API 연결 테스트")
    public void testGeminiConnection() {
        String apiKey = apiProperties.getGemini().getApiKey();
        log.info("### [Gemini] 호출 시작 - 모델: gemini-2.0-flash");
        
        GeminiRequest.RequestBody requestBody = GeminiRequest.RequestBody.builder()
            .contents(Collections.singletonList(
                GeminiRequest.Content.builder()
                    .parts(Collections.singletonList(
                        GeminiRequest.Part.builder().text("Return 'SUCCESS' in JSON format.").build()
                    )).build()
            )).build();

        try {
            GeminiResponse response = geminiClient.generateContent(apiKey, requestBody);
            assertThat(response).isNotNull();
            log.info("### [Gemini] 연결 성공! 응답: {}", response.getText());
        } catch (Exception e) {
            log.error("### [Gemini] 연결 실패! 에러: {}", e.getMessage());
            log.error("### [Gemini] 가이드: 2026년 시점에서 1.5 모델이 은퇴했을 수 있습니다. 2.0 모델로 호출을 시도했습니다.");
        }
    }
}
