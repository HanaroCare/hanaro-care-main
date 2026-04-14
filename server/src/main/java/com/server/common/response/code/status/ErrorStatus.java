package com.server.common.response.code.status;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import com.server.common.response.code.BaseErrorCode;
import com.server.common.response.code.ErrorReasonDTO;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    //일반 응답
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON500", "서버 에러, 관리자에게 문의 바랍니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON400", "잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COMMON401", "인증이 필요합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON403", "금지된 요청입니다."),
    // auth
    AUTH_BAD_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH_001", "아이디 또는 비밀번호가 일치하지 않습니다."),
    AUTH_DUPLICATE_USERNAME(HttpStatus.CONFLICT, "AUTH_002", "이미 사용 중인 아이디입니다."),
    AUTH_CERT_REQUIRED(HttpStatus.FORBIDDEN, "AUTH_003", "하나 인증이 완료된 사용자만 간편 로그인을 사용할 수 있습니다."),
    AUTH_SIMPLE_NOT_REGISTERED(HttpStatus.NOT_FOUND, "AUTH_004", "등록된 인증 정보가 없습니다."),
    AUTH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "AUTH_005", "유효하지 않은 토큰입니다."),
    AUTH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH_006", "토큰이 만료되었습니다."),
    AUTH_TOKEN_MISMATCH(HttpStatus.UNAUTHORIZED, "AUTH_007", "토큰이 일치하지 않습니다. 다시 로그인하세요."),

    //card

    //asset ( 예시 )
    _PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "PRODUCT_1", "상품을 찾을 수 없습니다."),
    _PRODUCT_ALREADY_JOINED(HttpStatus.BAD_REQUEST, "PRODUCT_2", "이미 가입된 상품입니다."),
    _PRODUCT_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "PRODUCT_3", "가입 불가능한 상품입니다."),
    _PRODUCT_INVALID_TYPE(HttpStatus.BAD_REQUEST, "PRODUCT_4", "유효하지 않은 상품 타입입니다."),

    // simulation
    SIMULATION_NOT_FOUND(HttpStatus.NOT_FOUND, "SIMULATION_404", "시뮬레이션 결과를 찾을 수 없습니다.");

    //inheritance

    //myhana


    private final HttpStatus httpStatus;        // HTTP 상태 코드
    private final String code;                  // 내부적인 에러 코드. 도메인명 + 숫자로 구성. 숫자는 HTTP 상태코드 100의자리 참고
    private final String message;               // FE에 전달할 오류 메세지

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
