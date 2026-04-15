package com.server.inheritance.dto.validatior;

import com.server.inheritance.dto.LetterRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class LetterRequestValidator implements
    ConstraintValidator<ValidLetterRequest, LetterRequestDto> {

  @Override
  public boolean isValid(LetterRequestDto dto, ConstraintValidatorContext context) {
    if (dto == null) {
      return true;
    }
    if (dto.getLetterTypeCd() == null) {
      return false;
    }

    return switch (dto.getLetterTypeCd()) {
      case WRITING -> {
        // 텍스트 편지: letterCont 필수
        boolean valid = StringUtils.hasText(dto.getLetterCont());
        if (!valid) {
          context.disableDefaultConstraintViolation();
          context.buildConstraintViolationWithTemplate("텍스트 편지는 내용을 입력해야 합니다.")
              .addPropertyNode("letterCont")
              .addConstraintViolation();
        }
        yield valid;
      }
      case VOICE -> {
        // voice 파일 검증은 Service에서 처리
        yield true;
      }
    };
  }
}
