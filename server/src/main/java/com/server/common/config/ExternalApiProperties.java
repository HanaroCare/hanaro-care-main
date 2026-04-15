package com.server.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "external")
public class ExternalApiProperties {

    private Gemini gemini = new Gemini();
    private PublicData publicData = new PublicData();

    @Getter @Setter
    public static class Gemini {
        private String baseUrl;
        private String apiKey;
    }

    @Getter @Setter
    public static class PublicData {
        private String baseUrl;
        private String apiKey;
    }
}
