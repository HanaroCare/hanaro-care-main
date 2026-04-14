package com.server.common.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = LoginIdValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginId {

  String message() default "아이디는 4자 이상 20자 이하의 영문자와 숫자만 사용할 수 있습니다.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
