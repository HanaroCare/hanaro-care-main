package com.server.common.config;

import java.time.Duration;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "external.openai")
public class OpenAiProperties {
	private String baseUrl;
	private String apiKey;
	private String model = "gpt-4o";
	private Duration connectTimeout = Duration.ofSeconds(5);
	private Duration readTimeout = Duration.ofSeconds(30);
}
