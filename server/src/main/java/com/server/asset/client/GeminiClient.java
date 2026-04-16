package com.server.asset.client;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.server.asset.dto.external.GeminiRequest;
import com.server.asset.dto.external.GeminiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final RestTemplate restTemplate;

    @Value("${external.gemini.base-url}")
    private String baseUrl;

    @Value("${external.gemini.api-key}")
    private String apiKey;

    private static final String GENERATE_PATH = "/models/gemini-2.0-flash:generateContent";

    public GeminiResponse generateContent(GeminiRequest.RequestBody requestBody) {
        try {
            URI uri = UriComponentsBuilder
                .fromUriString(baseUrl + GENERATE_PATH)
                .queryParam("key", apiKey)
                .build(false)
                .toUri();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<GeminiRequest.RequestBody> entity = new HttpEntity<>(requestBody, headers);

            log.debug("[Gemini] 요청 URI: {}", uri);

            return restTemplate.postForObject(uri, entity, GeminiResponse.class);

        } catch (RestClientResponseException e) {
            log.error("[Gemini] API 호출 실패: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            log.error("[Gemini] 예상치 못한 오류 발생: {}", e.getMessage());
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
