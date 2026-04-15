package com.server.auth.service;

import java.time.LocalDateTime;
import lombok.Getter;

@Getter
public class PhoneAuthRecord {

  private static final int CODE_EXPIRE_MINUTES = 3;
  private static final int VERIFIED_EXPIRE_MINUTES = 5;

  private final String code;
  private final LocalDateTime issuedAt;
  private final LocalDateTime verifiedAt;

  public PhoneAuthRecord(String code) {
    this.code = code;
    this.issuedAt = LocalDateTime.now();
    this.verifiedAt = null;
  }

  private PhoneAuthRecord(String code, LocalDateTime issuedAt, LocalDateTime verifiedAt) {
    this.code = code;
    this.issuedAt = issuedAt;
    this.verifiedAt = verifiedAt;
  }

  public boolean isPendingValid() {
    return verifiedAt == null
        && LocalDateTime.now().isBefore(issuedAt.plusMinutes(CODE_EXPIRE_MINUTES));
  }

  public boolean isVerifiedValid() {
    return verifiedAt != null
        && LocalDateTime.now().isBefore(verifiedAt.plusMinutes(VERIFIED_EXPIRE_MINUTES));
  }

  public PhoneAuthRecord markVerified() {
    return new PhoneAuthRecord(code, issuedAt, LocalDateTime.now());
  }
}
