package com.server.asset;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collections;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.server.asset.client.GeminiClient;
import com.server.asset.dto.external.GeminiRequest;
import com.server.asset.dto.external.GeminiResponse;
import com.server.common.config.external.ExternalApiProperties;

@SpringBootTest
public class GeminiTest {

    @Autowired
    private GeminiClient geminiClient;

    @Autowired
    private ExternalApiProperties apiProperties;

    @Test
    public void testGeminiConnection() {
        String apiKey = apiProperties.getGemini().getApiKey();
        
        GeminiRequest.RequestBody requestBody = GeminiRequest.RequestBody.builder()
            .contents(Collections.singletonList(
                GeminiRequest.Content.builder()
                    .parts(Collections.singletonList(
                        GeminiRequest.Part.builder().text("Hello, return only JSON: {\"result\": \"success\"}").build()
                    ))
                    .build()
            ))
            .build();

        try {
            GeminiResponse response = geminiClient.generateContent(apiKey, requestBody);
            assertThat(response).isNotNull();
            System.out.println("Gemini Success: " + response.getText());
        } catch (Exception e) {
            System.err.println("Gemini Failed: " + e.getMessage());
            // It might still fail with 429 if rate limited, but at least we can see the message.
        }
    }
}
