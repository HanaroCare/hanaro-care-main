package com.server.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(GeminiProperties.class)
@RequiredArgsConstructor
public class GeminiConfig {

	private final GeminiProperties geminiProperties;

	@Bean("geminiRestClient")
	public RestClient geminiRestClient() {
		return RestClient.builder()
			.baseUrl(geminiProperties.getBaseUrl())
			.build();
	}
}
