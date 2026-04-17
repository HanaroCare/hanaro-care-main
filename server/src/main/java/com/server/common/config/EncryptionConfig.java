package com.server.common.config;

import com.server.common.converter.AccountNumConverter;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * 애플리케이션 기동 시 암호화 키를 AttributeConverter 에 주입한다.
 * JPA Converter 는 Spring DI 컨텍스트 밖에서 인스턴스화될 수 있으므로
 * 정적(static) setter 패턴으로 키를 공유한다.
 */
@Slf4j
@Configuration
public class EncryptionConfig {

    @Value("${encrypt.aes.key}")
    private String aesKey;

    @PostConstruct
    public void initConverterKey() {
        AccountNumConverter.setKey(aesKey);
        log.info("[EncryptionConfig] AccountNumConverter AES-256 키 초기화 완료");
    }
}