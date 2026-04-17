package com.server.auth.service;

import java.time.Duration;
import java.time.Instant;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
public class PhoneAuthRecord {

  private static final Duration CODE_EXPIRE = Duration.ofMinutes(5);
  private static final Duration VERIFIED_EXPIRE = Duration.ofMinutes(5);

  private final String code;
  private final Instant issuedAt;
  private final Instant verifiedAt;

  public PhoneAuthRecord(String code) {
    this.code = code;
    this.issuedAt = Instant.now();
    this.verifiedAt = null;
  }

  private PhoneAuthRecord(String code, Instant issuedAt, Instant verifiedAt) {
    this.code = code;
    this.issuedAt = issuedAt;
    this.verifiedAt = verifiedAt;
  }

  public boolean isPendingValid() {
    Instant now = Instant.now();
    Duration elapsed = Duration.between(issuedAt, now);
    long secondsLeft = CODE_EXPIRE.minus(elapsed).getSeconds();

    log.debug("[isPendingValid] issuedAt={} | elapsed={}s | secondsLeft={}s | alreadyVerified={}",
        issuedAt.toEpochMilli(), elapsed.getSeconds(), secondsLeft, verifiedAt != null);

    return elapsed.compareTo(CODE_EXPIRE) < 0;
  }

  public boolean isVerifiedValid() {
    if (verifiedAt == null) return false;
    Duration elapsed = Duration.between(verifiedAt, Instant.now());
    return elapsed.compareTo(VERIFIED_EXPIRE) < 0;
  }

  public PhoneAuthRecord markVerified() {
    return new PhoneAuthRecord(code, issuedAt, Instant.now());
  }
}
