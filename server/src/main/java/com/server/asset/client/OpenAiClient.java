package com.server.asset.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.common.config.OpenAiProperties;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAiClient {

    @Qualifier("openAiRestClient")
    private final RestClient openAiRestClient;
    private final OpenAiProperties openAiProperties;
    private final ObjectMapper objectMapper;

    /**
     * 프롬프트를 받아 ChatGPT 응답의 content 텍스트를 반환한다.
     */
    public String chat(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "model", openAiProperties.getModel(),
            "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        try {
            log.debug("[OpenAI] 요청 모델: {}", openAiProperties.getModel());

            String rawJson = openAiRestClient.post()
                .uri("/v1/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

            OpenAiResponse response = objectMapper.readValue(rawJson, OpenAiResponse.class);

            if (response.choices() == null || response.choices().isEmpty()) {
                throw new RuntimeException("[OpenAI] 응답 choices가 비어있음");
            }

            String content = response.choices().get(0).message().content();
            log.debug("[OpenAI] 응답 content 수신 완료");
            return content;

        } catch (RestClientResponseException e) {
            log.error("[OpenAI] API 호출 실패: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            log.error("[OpenAI] 예상치 못한 오류 발생: {}", e.getMessage());
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenAiResponse(List<Choice> choices) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        private record Choice(Message message) {}
        @JsonIgnoreProperties(ignoreUnknown = true)
        private record Message(String content) {}
    }
}
