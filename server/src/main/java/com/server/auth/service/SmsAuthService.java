package com.server.auth.service;

import com.server.auth.dto.PasswordFindRequestDTO;
import com.server.auth.dto.SmsRequestDTO;
import com.server.auth.dto.SmsVerifyRequestDTO;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.repository.UserRepository;
import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsAuthService {

  private static final SecureRandom RANDOM = new SecureRandom();

  private final SmsService smsService;
  private final UserRepository userRepository;
  private final ConcurrentHashMap<String, PhoneAuthRecord> store = new ConcurrentHashMap<>();

  public void sendAuthCode(SmsRequestDTO request) {
    String phone = request.getPhone();
    String code = String.format("%06d", RANDOM.nextInt(1_000_000));
    store.put(phone, new PhoneAuthRecord(code));
    smsService.send(phone, code);
    log.info("[인증번호 발송] phone={}", phone);
  }

  public void sendPasswordFindCode(PasswordFindRequestDTO request) {
    userRepository.findByLoginIdAndUserPhone(request.getLoginId(), request.getUserPhone())
        .orElseThrow(() -> new ApiException(ErrorStatus.AUTH_USER_NOT_FOUND));

    String phone = request.getUserPhone();
    String code = String.format("%06d", RANDOM.nextInt(1_000_000));
    store.put(phone, new PhoneAuthRecord(code));
    smsService.send(phone, code);
    log.info("[비밀번호 찾기 인증번호 발송] loginId={}, phone={}", request.getLoginId(), phone);
  }

  public void verifySms(SmsVerifyRequestDTO request) {
    String phone = request.getPhone();
    PhoneAuthRecord record = store.get(phone);

    if (record == null || !record.isPendingValid()) {
      throw new ApiException(ErrorStatus.SMS_CODE_EXPIRED);
    }

    if (!record.getCode().equals(request.getAuthCode())) {
      throw new ApiException(ErrorStatus.SMS_CODE_MISMATCH);
    }

    store.put(phone, record.markVerified());
    log.info("[인증 완료] phone={}", phone);
  }

  public boolean isVerified(String phone) {
    PhoneAuthRecord record = store.get(phone);
    return record != null && record.isVerifiedValid();
  }

  public void clearVerification(String phone) {
    store.remove(phone);
    log.debug("[인증 정보 삭제] phone={}", phone);
  }
}
