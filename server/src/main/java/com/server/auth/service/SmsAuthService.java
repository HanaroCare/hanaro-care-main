package com.server.auth.service;

import com.server.auth.dto.DormantSmsRequestDTO;
import com.server.auth.dto.PasswordFindRequestDTO;
import com.server.auth.dto.SmsRequestDTO;
import com.server.auth.dto.SmsVerifyRequestDTO;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBUser;
import com.server.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsAuthService {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final DateTimeFormatter FMT =
      DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.of("Asia/Seoul"));

  private static final String KEY_AUTH = "sms:auth:";
  private static final String KEY_VERIFIED = "sms:verified:";
  private static final long AUTH_TTL_MIN = 3L;
  private static final long VERIFIED_TTL_MIN = 5L;

  private final SmsService smsService;
  private final UserRepository userRepository;
  private final StringRedisTemplate redisTemplate;

  /**
   * 애플리케이션 기동 시 Redis 연결 가능 여부를 즉시 확인한다.
   */
  @PostConstruct
  public void checkRedisConnection() {
    try {
      String pong = redisTemplate.getConnectionFactory()
          .getConnection().ping();
      log.info("[SmsAuthService] Redis 연결 확인 OK — PING={}", pong);
    } catch (Exception e) {
      log.error("[SmsAuthService] ★★★ Redis 연결 실패 ★★★ — 인증번호 저장 불가. 원인: {}", e.getMessage(), e);
    }
  }

  private static String normalize(String phone) {
    if (phone == null) {
      return "";
    }
    String result = phone.replaceAll("[^0-9]", "");
    if (result.length() != 10 && result.length() != 11) {
      log.warn("[번호 정규화 경고] 예상치 못한 자릿수 raw={} normalized={} length={}", phone, result,
          result.length());
    }
    return result;
  }

  public void sendAuthCode(SmsRequestDTO request) {
    String rawPhone = request.getPhone();
    String phone = normalize(rawPhone);
    String code = String.format("%06d", RANDOM.nextInt(1_000_000));

    // Redis에 먼저 저장 — 실패하면 SMS 발송하지 않음
    boolean replaced = Boolean.TRUE.equals(redisTemplate.hasKey(KEY_AUTH + phone));
    try {
      redisTemplate.opsForValue().set(KEY_AUTH + phone, code, AUTH_TTL_MIN, TimeUnit.MINUTES);
      log.info("[인증번호 Redis 저장 완료] key={} ttl={}min 이전레코드교체={}",
          KEY_AUTH + maskPhone(phone), AUTH_TTL_MIN, replaced);
    } catch (Exception e) {
      log.error("[인증번호 Redis 저장 실패] key={} 원인={}", KEY_AUTH + maskPhone(phone), e.getMessage(), e);
      throw new ApiException(ErrorStatus.SMS_SEND_FAILED);
    }

    log.info("[인증번호 발송] rawPhone={} | normalizedKey={} | 서버시각={} | 이전레코드교체={}",
        maskPhone(rawPhone), phone, FMT.format(Instant.now()), replaced);

    // Redis 저장 성공 후 SMS 발송
    smsService.send(phone, code);
  }

  public void sendPasswordFindCode(PasswordFindRequestDTO request) {
    // userPhone은 AES 암호화 컬럼 — SQL 파라미터 비교 불가, 복호화된 값을 Java에서 비교
    TBUser pwdFindUser = userRepository.findByLoginId(request.getLoginId())
        .orElseThrow(() -> new ApiException(ErrorStatus.FIND_ID_USER_NOT_FOUND));
    if (pwdFindUser.getUserPhone() == null
        || !normalize(pwdFindUser.getUserPhone()).equals(normalize(request.getUserPhone()))) {
      throw new ApiException(ErrorStatus.FIND_ID_USER_NOT_FOUND);
    }

    String phone = normalize(request.getUserPhone());
    String code = String.format("%06d", RANDOM.nextInt(1_000_000));
    try {
      redisTemplate.opsForValue().set(KEY_AUTH + phone, code, AUTH_TTL_MIN, TimeUnit.MINUTES);
      log.info("[비밀번호 찾기 Redis 저장 완료] key={}", KEY_AUTH + maskPhone(phone));
    } catch (Exception e) {
      log.error("[비밀번호 찾기 Redis 저장 실패] 원인={}", e.getMessage(), e);
      throw new ApiException(ErrorStatus.SMS_SEND_FAILED);
    }
    smsService.send(phone, code);
    log.info("[비밀번호 찾기 인증번호 발송] loginId={}, phone={}", request.getLoginId(), maskPhone(phone));
  }

  public void sendDormantSms(DormantSmsRequestDTO request) {
    TBUser user = userRepository.findByLoginId(request.getLoginId())
        .orElseThrow(() -> new ApiException(ErrorStatus.AUTH_USER_NOT_FOUND));

    String normalizedInput = normalize(request.getUserPhone());
    String normalizedDb = normalize(user.getUserPhone());

    log.info("[휴면 SMS 검증] loginId={} inputPhone={} dbPhone={}",
        request.getLoginId(), maskPhone(normalizedInput), maskPhone(normalizedDb));

    if (!normalizedDb.equals(normalizedInput)) {
      log.warn("[휴면 SMS 실패] 번호 불일치 loginId={} inputPhone={} dbPhone={}",
          request.getLoginId(), maskPhone(normalizedInput), maskPhone(normalizedDb));
      throw new ApiException(ErrorStatus.DORMANT_PHONE_MISMATCH);
    }

    String code = String.format("%06d", RANDOM.nextInt(1_000_000));
    try {
      redisTemplate.opsForValue()
          .set(KEY_AUTH + normalizedDb, code, AUTH_TTL_MIN, TimeUnit.MINUTES);
      log.info("[휴면 Redis 저장 완료] key={}", KEY_AUTH + maskPhone(normalizedDb));
    } catch (Exception e) {
      log.error("[휴면 Redis 저장 실패] 원인={}", e.getMessage(), e);
      throw new ApiException(ErrorStatus.SMS_SEND_FAILED);
    }
    smsService.send(normalizedDb, code);
    log.info("[휴면 계정 SMS 발송] loginId={} phone={}", request.getLoginId(), maskPhone(normalizedDb));
  }

  public void verifySms(SmsVerifyRequestDTO request) {
    String rawPhone = request.getPhone();
    String phone = normalize(rawPhone);
    String authKey = KEY_AUTH + phone;

    log.info("[인증 시도] rawPhone={} | normalizedKey={} | 서버시각={} | 레코드존재={}",
        maskPhone(rawPhone), phone, FMT.format(Instant.now()),
        Boolean.TRUE.equals(redisTemplate.hasKey(authKey)));

    String storedCode = redisTemplate.opsForValue().get(authKey);
    if (storedCode == null) {
      log.warn("[인증 실패] 레코드 없음 - normalizedKey={}", phone);
      throw new ApiException(ErrorStatus.SMS_CODE_EXPIRED);
    }

    if (!storedCode.equals(request.getAuthCode())) {
      log.warn("[인증 실패] 코드 불일치 phone={}", maskPhone(phone));
      throw new ApiException(ErrorStatus.SMS_CODE_MISMATCH);
    }

    // 인증 완료 도장: sms:verified:{phone} (TTL 5분)
    redisTemplate.opsForValue()
        .set(KEY_VERIFIED + phone, "true", VERIFIED_TTL_MIN, TimeUnit.MINUTES);
    redisTemplate.delete(authKey);

    log.info("[인증 완료] phone={}", maskPhone(phone));
  }

  public boolean isVerified(String phone) {
    String normalized = normalize(phone);
    return Boolean.TRUE.equals(redisTemplate.hasKey(KEY_VERIFIED + normalized));
  }

  public void clearVerification(String phone) {
    String normalized = normalize(phone);
    redisTemplate.delete(KEY_AUTH + normalized);
    redisTemplate.delete(KEY_VERIFIED + normalized);
    log.debug("[인증 정보 삭제] phone={}", maskPhone(normalized));
  }

  private String maskPhone(String phone) {
    if (phone == null || phone.length() < 7) {
      return "****";
    }
    return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
  }
}
