package com.server.common.config;

import com.server.common.converter.AccountNumConverter;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

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