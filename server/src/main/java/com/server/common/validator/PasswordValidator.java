package com.server.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class PasswordValidator implements ConstraintValidator<Password, String> {

  /**
   * 영문(대소문자) 필수: (?=.*[A-Za-z]) 숫자 필수: (?=.*\\d) 특수문자 선택 및 전체 길이(8~16자): [A-Za-z\\d@$!%*#?&]{8,16}
   */
  private static final String PASSWORD_PATTERN = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,16}$";

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (!StringUtils.hasText(value)) {
      return false;
    }
    return value.matches(PASSWORD_PATTERN);
  }
}
