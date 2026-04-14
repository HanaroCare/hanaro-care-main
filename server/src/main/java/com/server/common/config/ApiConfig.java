package com.server.common.config;

import java.util.concurrent.TimeUnit;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.Logger;
import feign.Retryer;

@Configuration
@EnableFeignClients(basePackages = "com.server")
public class ApiConfig {

    @Bean
    Logger.Level feignLoggerLevel() {
        // 개발 중에는 FULL, 운영 시에는 BASIC 권장
        return Logger.Level.FULL;
    }

    @Bean
    public Retryer retryer() {
        // 외부 API 호출 실패 시 재시도 설정 (기본 100ms 간격, 최대 1초, 3번 시도)
        return new Retryer.Default(100, TimeUnit.SECONDS.toMillis(1L), 3);
    }
}
