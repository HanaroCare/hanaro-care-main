package com.server.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FaceIdValidator implements ConstraintValidator<FaceId, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    // 생체 인증 값은 보통 비어있지 않은 토큰 형태임을 검증
    return value != null && !value.trim().isEmpty();
  }
}
