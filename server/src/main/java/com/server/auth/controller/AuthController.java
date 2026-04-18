package com.server.auth.controller;

import com.server.auth.dto.DormantSmsRequestDTO;
import com.server.auth.dto.FindIdRequestDTO;
import com.server.auth.dto.FindIdResponseDTO;
import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.PasswordFindRequestDTO;
import com.server.auth.dto.ResetPasswordRequestDTO;
import com.server.auth.dto.SignUpRequestDTO;
import com.server.auth.dto.SmsRequestDTO;
import com.server.auth.dto.SmsVerifyRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.dto.UnlockDormantRequestDTO;
import com.server.auth.response.ApiPasswordFindResponse;
import com.server.auth.response.ApiSmsVerifyResponse;
import com.server.auth.service.AuthService;
import com.server.auth.service.SmsAuthService;
import com.server.common.response.ApiResponse;
import com.server.common.validator.LoginId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "인증 API")
@Validated
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final SmsAuthService smsAuthService;

  @Operation(summary = "회원가입 API", description = "신규 회원을 등록한다.")
  @PostMapping("/signup")
  public ApiResponse<String> signUp(@Valid @RequestBody SignUpRequestDTO request) {
    authService.signUp(request);
    return ApiResponse.onSuccess("회원가입이 완료되었습니다.");
  }

  @Operation(
      summary = "통합 로그인 API",
      description = "실제 인증은 Security Filter가 처리하며, 이 메서드는 Swagger 문서화 전용입니다."
  )
  @PostMapping("/login")
  public ApiResponse<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
    // 1번 방식(Filter 기반)에서는 이 코드가 실행되지 않아야 함
    throw new IllegalStateException("Security Filter가 가로채지 못했습니다. 설정을 확인하세요.");
  }

  @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 이용해 새로운 액세스 토큰을 발급한다.")
  @PostMapping("/refresh")
  public ApiResponse<TokenResponseDTO> refresh(@RequestBody TokenResponseDTO request) {
    return ApiResponse.onSuccess(authService.refresh(request.getRefreshToken()));
  }

  @Operation(
      summary = "휴면 계정 해제 API",
      description = "본인인증 완료 후 휴면 상태를 해제하고 새 비밀번호를 설정합니다."
  )
  @PostMapping("/unlock-dormant")
  public ApiResponse<String> unlockDormant(@Valid @RequestBody UnlockDormantRequestDTO request) {
    authService.unlockDormant(request);
    return ApiResponse.onSuccess("휴면 계정 해제가 완료되었습니다.");
  }

  @Operation(summary = "아이디 중복 체크", description = "이미 사용 중이면 ApiException(USER_ALREADY_EXISTS)을 던집니다.")
  @GetMapping("/check-id")
  public ApiResponse<String> checkLoginId(
      @Parameter(description = "아이디 (영문·숫자 4~20자)", example = "hong1234")
      @RequestParam @LoginId String loginId) {
    authService.checkLoginId(loginId); // 중복 시 서비스에서 ApiException 발생
    return ApiResponse.onSuccess("사용 가능한 아이디입니다.");
  }

  @Operation(summary = "이름 존재 여부 확인", description = "아이디 찾기 시 해당 이름이 DB에 등록되어 있는지 확인합니다.")
  @GetMapping("/check-user-name")
  public ApiResponse<String> checkUserByName(
      @Parameter(description = "확인할 이름", example = "홍길동")
      @RequestParam String userNm) {
    authService.checkUserByName(userNm);
    return ApiResponse.onSuccess("등록된 이름입니다.");
  }

  @Operation(summary = "아이디 존재 여부 확인", description = "비밀번호 찾기 시 해당 아이디가 DB에 등록되어 있는지 확인합니다.")
  @GetMapping("/check-user")
  public ApiResponse<String> checkUserExists(
      @Parameter(description = "확인할 아이디", example = "hong1234")
      @RequestParam String loginId) {
    authService.checkUserExists(loginId);
    return ApiResponse.onSuccess("등록된 아이디입니다.");
  }

  @Operation(summary = "비밀번호 찾기 이름 확인", description = "아이디와 이름의 조합이 DB에 존재하는지 확인합니다.")
  @GetMapping("/check-name")
  public ApiResponse<String> checkUserNm(
      @Parameter(description = "가입 시 사용한 아이디", example = "hong1234")
      @RequestParam String loginId,
      @Parameter(description = "가입 시 등록한 이름", example = "홍길동")
      @RequestParam String userNm) {
    authService.checkUserNm(loginId, userNm);
    return ApiResponse.onSuccess("등록된 이름입니다.");
  }

  @Operation(summary = "SMS 인증번호 발송")
  @PostMapping("/sms/send")
  public ApiResponse<String> sendSms(@Valid @RequestBody SmsRequestDTO request) {
    smsAuthService.sendAuthCode(request);
    return ApiResponse.onSuccess("인증번호가 발송되었습니다.");
  }

  @Operation(summary = "비밀번호 찾기용 인증번호 발송")
  @ApiPasswordFindResponse
  @PostMapping("/sms/send/password-find")
  public ApiResponse<String> sendPasswordFindCode(
      @Valid @RequestBody PasswordFindRequestDTO request) {
    smsAuthService.sendPasswordFindCode(request);
    return ApiResponse.onSuccess("인증번호가 발송되었습니다.");
  }

  @Operation(summary = "휴면 계정 해제용 인증번호 발송", description = "아이디와 전화번호가 DB 정보와 일치할 때만 인증번호를 발송합니다.")
  @PostMapping("/sms/send/dormant")
  public ApiResponse<String> sendDormantSms(@Valid @RequestBody DormantSmsRequestDTO request) {
    smsAuthService.sendDormantSms(request);
    return ApiResponse.onSuccess("인증번호가 발송되었습니다.");
  }

  @Operation(summary = "SMS 인증번호 확인")
  @ApiSmsVerifyResponse
  @PostMapping("/sms/verify")
  public ApiResponse<String> verifySms(@Valid @RequestBody SmsVerifyRequestDTO request) {
    smsAuthService.verifySms(request);
    return ApiResponse.onSuccess("인증에 성공하였습니다.");
  }

  @Operation(summary = "아이디 찾기", description = "SMS 인증 완료 후 이름과 전화번호로 마스킹된 아이디를 반환합니다.")
  @PostMapping("/find-id")
  public ApiResponse<FindIdResponseDTO> findId(@Valid @RequestBody FindIdRequestDTO request) {
    return ApiResponse.onSuccess(authService.findId(request));
  }

  @Operation(summary = "비밀번호 재설정", description = "SMS 인증 완료 후 새 비밀번호로 업데이트합니다.")
  @PostMapping("/reset-password")
  public ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
    authService.resetPassword(request);
    return ApiResponse.onSuccess("비밀번호가 변경되었습니다.");
  }
}