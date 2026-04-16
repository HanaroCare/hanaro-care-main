package com.server.auth.service;

import com.server.auth.dto.DormantSmsRequestDTO;
import com.server.auth.dto.PasswordFindRequestDTO;
import com.server.auth.dto.SmsRequestDTO;
import com.server.auth.dto.SmsVerifyRequestDTO;
import com.server.user.entity.TBUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.repository.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsAuthService {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final DateTimeFormatter FMT =
      DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.of("Asia/Seoul"));

  private final SmsService smsService;
  private final UserRepository userRepository;
  private final ConcurrentHashMap<String, PhoneAuthRecord> store = new ConcurrentHashMap<>();

  private static String normalize(String phone) {
    if (phone == null) return "";
    String result = phone.replaceAll("[^0-9]", "");
    if (result.length() != 10 && result.length() != 11) {
      log.warn("[번호 정규화 경고] 예상치 못한 자릿수 raw={} normalized={} length={}", phone, result, result.length());
    }
    return result;
  }

  public void sendAuthCode(SmsRequestDTO request) {
    String rawPhone = request.getPhone();
    String phone = normalize(rawPhone);
    String code = String.format("%06d", RANDOM.nextInt(1_000_000));

    boolean replaced = store.containsKey(phone);
    store.put(phone, new PhoneAuthRecord(code));

    log.info("[인증번호 발송] rawPhone={} | normalizedKey={} | 서버시각={} | 이전레코드교체={}",
        maskPhone(rawPhone), phone, FMT.format(Instant.now()), replaced);

    smsService.send(phone, code);
  }

  public void sendPasswordFindCode(PasswordFindRequestDTO request) {
    userRepository.findByLoginIdAndUserPhone(request.getLoginId(), request.getUserPhone())
        .orElseThrow(() -> new ApiException(ErrorStatus.FIND_ID_USER_NOT_FOUND));

    String phone = normalize(request.getUserPhone());
    String code = String.format("%06d", RANDOM.nextInt(1_000_000));
    store.put(phone, new PhoneAuthRecord(code));
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
    store.put(normalizedDb, new PhoneAuthRecord(code));
    smsService.send(normalizedDb, code);
    log.info("[휴면 계정 SMS 발송] loginId={} phone={}", request.getLoginId(), maskPhone(normalizedDb));
  }

  public void verifySms(SmsVerifyRequestDTO request) {
    String rawPhone = request.getPhone();
    String phone = normalize(rawPhone);

    log.info("[인증 시도] rawPhone={} | normalizedKey={} | 서버시각={} | 레코드존재={}",
        maskPhone(rawPhone), phone, FMT.format(Instant.now()), store.containsKey(phone));

    PhoneAuthRecord existing = store.get(phone);
    if (existing == null) {
      log.warn("[인증 실패] 레코드 없음 - normalizedKey={} | store.keys={}", phone, store.keySet());
      throw new ApiException(ErrorStatus.SMS_CODE_EXPIRED);
    }

    PhoneAuthRecord updatedRecord = store.computeIfPresent(phone, (key, currentRecord) -> {
      if (!currentRecord.isPendingValid()) {
        log.warn("[인증 실패] 시간 만료 phone={}", maskPhone(phone));
        throw new ApiException(ErrorStatus.SMS_CODE_EXPIRED);
      }
      if (!currentRecord.getCode().equals(request.getAuthCode())) {
        log.warn("[인증 실패] 코드 불일치 phone={}", maskPhone(phone));
        throw new ApiException(ErrorStatus.SMS_CODE_MISMATCH);
      }
      return currentRecord.markVerified();
    });

    if (updatedRecord == null) {
      log.warn("[인증 실패] computeIfPresent null 반환 phone={}", maskPhone(phone));
      throw new ApiException(ErrorStatus.SMS_CODE_EXPIRED);
    }

    log.info("[인증 완료] phone={}", maskPhone(phone));
  }

  public boolean isVerified(String phone) {
    String normalized = normalize(phone);
    PhoneAuthRecord record = store.get(normalized);
    return record != null && record.isVerifiedValid();
  }

  public void clearVerification(String phone) {
    String normalized = normalize(phone);
    store.remove(normalized);
    log.debug("[인증 정보 삭제] phone={}", maskPhone(normalized));
  }

  private String maskPhone(String phone) {
    if (phone == null || phone.length() < 7) return "****";
    return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
  }
}
