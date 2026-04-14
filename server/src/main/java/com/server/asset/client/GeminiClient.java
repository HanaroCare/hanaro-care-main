package com.server.asset.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.server.asset.dto.external.GeminiRequest;
import com.server.asset.dto.external.GeminiResponse;

@FeignClient(name = "geminiClient", url = "${external.gemini.base-url}")
public interface GeminiClient {
    @PostMapping("/v1/models/gemini-1.5-flash:generateContent")
    GeminiResponse generateContent(
        @RequestParam("key") String apiKey,
        @RequestBody GeminiRequest.RequestBody requestBody
    );
}
