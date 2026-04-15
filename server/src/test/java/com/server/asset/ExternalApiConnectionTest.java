package com.server.asset;

import static org.assertj.core.api.Assertions.*;

import java.util.Collections;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.server.asset.client.BokjiroClient;
import com.server.asset.client.GeminiClient;
import com.server.asset.dto.external.GeminiRequest;
import com.server.asset.dto.external.GeminiResponse;
import com.server.asset.dto.external.PublicDataResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
public class ExternalApiConnectionTest {

    @Autowired private BokjiroClient bokjiroClient;
    @Autowired private GeminiClient geminiClient;

    @Test
    @DisplayName("복지로 API 연결 테스트")
    public void testBokjiroConnection() {
        log.info("### [복지로] 호출 시작");

        try {
            // 1. 목록 조회
            log.info("### [복지로] 1. 목록 조회 시도...");
            PublicDataResponse.WelfareListResponse response =
                bokjiroClient.getWelfareServices("003", "노인", null, 1, 5);

            if (response != null && response.getWantedList() != null) {
                log.info("### [복지로] 목록 조회 성공! 총 건수: {}",
                    response.getWantedList().getTotalCount());
            }

            // 2. 상세 조회
            log.info("### [복지로] 2. 상세 조회 시도 (ID: WLF00001138)...");
            String detail = bokjiroClient.getWelfareDetail("WLF00001138");
            log.info("### [복지로] 상세 조회 성공! 응답 길이: {}", detail.length());

        } catch (Exception e) {
            log.error("### [복지로] 연결 실패: {}", e.getMessage());
        }
    }

    @Test
    @DisplayName("Gemini API 연결 테스트 - 2.0 모델")
    public void testGeminiConnection() {
        log.info("### [Gemini] 호출 시작 - 모델: gemini-2.0-flash");

        GeminiRequest.RequestBody requestBody = GeminiRequest.RequestBody.builder()
            .contents(Collections.singletonList(
                GeminiRequest.Content.builder()
                    .parts(Collections.singletonList(
                        GeminiRequest.Part.builder()
                            .text("Return exactly 'OK' in JSON format.")
                            .build()
                    ))
                    .build()
            ))
            .build();

        try {
            // GeminiClient가 내부적으로 apiKey를 주입받아 처리
            GeminiResponse response = geminiClient.generateContent(requestBody);
            assertThat(response).isNotNull();
            log.info("### [Gemini] 연결 성공! 응답: {}", response.getText());
        } catch (Exception e) {
            log.error("### [Gemini] 연결 실패! 에러: {}", e.getMessage());
        }
    }
}
