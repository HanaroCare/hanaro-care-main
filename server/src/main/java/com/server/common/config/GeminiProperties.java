package com.server.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "external.gemini")
public class GeminiProperties {
	private String baseUrl;
	private String apiKey;
}
