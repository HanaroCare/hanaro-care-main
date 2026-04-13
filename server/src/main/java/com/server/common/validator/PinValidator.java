package com.server.common.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PinValidator implements ConstraintValidator<Pin, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    return value != null && value.matches("^\\d{6}$");
  }
}
