package com.server.inheritance.dto.validatior;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = LetterRequestValidator.class)
public @interface ValidLetterRequest {

  String message() default "편지 타입에 맞는 내용을 입력해주세요.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
