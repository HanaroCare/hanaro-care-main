package com.server.common.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AuthPatternValidator.class)
public @interface AuthPattern {

  String message() default "패턴은 최소 4개 이상의 점을 연결해야 합니다.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
