package com.server.simulation.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.server.simulation.dto.external.gemini.GeminiRequest;
import com.server.simulation.dto.external.gemini.GeminiResponse;

@FeignClient(name = "geminiClient", url = "${external.gemini.base-url}")
public interface GeminiClient {

    @PostMapping("/gemini-1.5-flash:generateContent")
    GeminiResponse generateContent(
        @RequestParam("key") String apiKey,
        @RequestBody GeminiRequest.RequestBody requestBody
    );
}
