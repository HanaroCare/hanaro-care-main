package com.server.common.response.code.status;


import com.server.common.response.code.BaseErrorCode;
import com.server.common.response.code.ErrorReasonDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
  // 일반 응답
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

  FAMILY_AUTH_NOT_FOUND(HttpStatus.NOT_FOUND, "FAMILY4041", "가족 권한 정보를 찾을 수 없습니다."),
  FAMILY_AUTH_NOT_APPROVED(HttpStatus.FORBIDDEN, "FAMILY4031", "아직 승인되지 않은 가족 권한입니다."),
  TRUST_VIEW_FORBIDDEN(HttpStatus.FORBIDDEN, "TRUST4032", "신탁 조회 권한이 없습니다."),

  // card

  // asset
  PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "ASSET_001", "가입한 상품 정보를 찾을 수 없습니다."),

  TRUST_SIMULATION_NOT_FOUND(HttpStatus.NOT_FOUND, "TRUST_001", "시뮬레이션 정보를 찾을 수 없습니다."),
  TRUST_USER_NOT_FOUND(HttpStatus.NOT_FOUND, "TRUST_002", "유저를 찾을 수 없습니다."),
  TRUST_CLAIM_AGENT_NOT_FOUND(HttpStatus.NOT_FOUND, "TRUST_003", "대리인을 찾을 수 없습니다."),
  TRUST_START_DATE_REQUIRED(HttpStatus.BAD_REQUEST, "TRUST_004", "날짜 지정 시 시작일은 필수입니다."),
  TRUST_JSON_PROCESSING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "TRUST_005",
      "설정 데이터 처리 중 오류가 발생했습니다."),
  TRUST_FIXED_PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "TRUST_006", "신탁 상품 정보를 찾을 수 없습니다."),
  TRUST_PRODUCT_ALREADY_EXISTS(HttpStatus.CONFLICT, "TRUST_007", "이미 가입된 신탁 상품이 있습니다."),
  TRUST_INVALID_PAYOUT_SETTINGS(HttpStatus.BAD_REQUEST, "TRUST_008", "집행 설정 정보가 올바르지 않습니다."),

  // pension
  PENSION_USER_NOT_FOUND(HttpStatus.NOT_FOUND, "PENSION_000", "유저를 찾을 수 없습니다."),
  PENSION_ASSET_NOT_FOUND(HttpStatus.NOT_FOUND, "PENSION_001", "해당 주택 자산이 없습니다."),
  PENSION_NOT_REAL_ESTATE(HttpStatus.BAD_REQUEST, "PENSION_002", "부동산 자산만 예측할 수 있습니다."),
  PENSION_NO_EVAL_AMT(HttpStatus.BAD_REQUEST, "PENSION_003", "현재 평가금액이 없어 처리할 수 없습니다."),
  PENSION_INVALID_PERIOD(HttpStatus.BAD_REQUEST, "PENSION_004", "조회 기간은 5년, 10년, 20년만 가능합니다."),
  PENSION_SIMULATION_NOT_FOUND(HttpStatus.NOT_FOUND, "PENSION_005", "저장된 주택연금 시뮬레이션이 없습니다. 먼저 비교 조회를 실행해 주세요."),
  PENSION_PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "PENSION_006", "주택연금 상품 정보를 찾을 수 없습니다."),
  PENSION_ALREADY_EXISTS(HttpStatus.CONFLICT, "PENSION_007", "이미 가입된 주택연금 상품이 있습니다."),
  PENSION_NOT_SUBSCRIBED(HttpStatus.NOT_FOUND, "PENSION_008", "가입된 주택연금 상품이 없습니다."),

  // simulation
  SIMULATION_NOT_FOUND(HttpStatus.NOT_FOUND, "SIMULATION_404", "시뮬레이션 결과를 찾을 수 없습니다."),
  SIMULATION_JSON_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SIMULATION_501",
      "시뮬레이션 상세 리포트 생성 중 오류가 발생했습니다."),
  SIMULATION_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "SIMULATION_400", "이미 진행 중인 시뮬레이션이 있습니다."),

  // asset
  ASSET_NOT_FOUND(HttpStatus.NOT_FOUND, "ASSET_404", "자산 정보를 찾을 수 없습니다."),
  ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "ACCOUNT_404", "계좌 정보를 찾을 수 없습니다.");

  // inheritance

  // myhana


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
