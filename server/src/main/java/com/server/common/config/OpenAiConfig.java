package com.server.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(OpenAiProperties.class)
@RequiredArgsConstructor
public class OpenAiConfig {

	private final OpenAiProperties openAiProperties;

	@Bean("openAiRestClient")
	public RestClient openAiRestClient() {
		SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(openAiProperties.getConnectTimeout());
		factory.setReadTimeout(openAiProperties.getReadTimeout());

		return RestClient.builder()
			.baseUrl(openAiProperties.getBaseUrl())
			.defaultHeader("Authorization", "Bearer " + openAiProperties.getApiKey())
			.requestFactory(factory)
			.build();
	}
}
