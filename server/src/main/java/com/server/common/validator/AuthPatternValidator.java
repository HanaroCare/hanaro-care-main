package com.server.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AuthPatternValidator implements ConstraintValidator<AuthPattern, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    // 숫자만 포함 && 길이 4~9자
    return value != null && value.matches("^\\d{4,9}$");
  }
}