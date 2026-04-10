package com.server.common.response.code.status;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import com.server.common.response.code.BaseErrorCode;
import com.server.common.response.code.ErrorReasonDTO;

@Getter
@AllArgsConstructor
public enum SuccessStatus implements BaseErrorCode {
    // 기본 응답
    _OK(HttpStatus.OK, "COMMON200", "성공입니다.");
    //추가할 응답이 있으면 아래에 추가하기

    private final HttpStatus httpStatus;        // HTTP 상태 코드
    private final String code;                  // 내부적인 에러 코드 ( 도메인명 + 숫자 )
    private final String message;               // FE에 전달할 메세지 (성공)

    @Override
    public ErrorReasonDTO getReason() {
        return ErrorReasonDTO.builder()
            .message(message)
            .code(code)
            .isSuccess(false)
            .build();
    }

    @Override
    public ErrorReasonDTO getReasonHttpStatus() {
        return ErrorReasonDTO.builder()
            .message(message)
            .code(code)
            .isSuccess(false)
            .httpStatus(httpStatus)
            .build();
    }

}
