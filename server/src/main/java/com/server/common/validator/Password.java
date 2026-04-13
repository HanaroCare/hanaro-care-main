package com.server.common.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
public @interface Password {

  String message() default "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}