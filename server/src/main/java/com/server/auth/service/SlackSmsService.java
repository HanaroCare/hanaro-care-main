package com.server.auth.service;

import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlackSmsService implements SmsService {

  private final RestTemplate restTemplate;

  @Value("${slack.webhook.url}")
  private String webhookUrl;

  @Override
  public void send(String phone, String code) {
    String text = String.format("[하나로케어 인증] 번호: %s, 인증번호: [%s]", phone, code);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, String>> entity = new HttpEntity<>(Map.of("text", text), headers);

    try {
      restTemplate.postForEntity(webhookUrl, entity, String.class);
      log.info("[슬랙 인증 발송 완료] phone={}", maskPhoneNumber(phone));
    } catch (Exception e) {
      log.error("[슬랙 발송 실패] phone={}, error={}", maskPhoneNumber(phone), e.getMessage());
      throw new ApiException(ErrorStatus.SMS_SEND_FAILED);
    }
  }

  /**
   * 전화번호 마스킹 헬퍼 메서드 예: 01012345678 -> 010****5678
   */
  private String maskPhoneNumber(String phone) {
    if (phone == null || phone.length() < 7) {
      return "****";
    }
    return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
  }
}