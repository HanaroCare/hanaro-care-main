package com.server.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class LoginIdValidator implements ConstraintValidator<LoginId, String> {

  // 영문자와 숫자만 허용, 4~20자
  private static final String ID_PATTERN = "^[a-zA-Z0-9]{4,20}$";

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) {
      return false;
    }
    return Pattern.matches(ID_PATTERN, value);
  }
}
