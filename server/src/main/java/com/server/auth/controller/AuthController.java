package com.server.auth.controller;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.PasswordFindRequestDTO;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  public ResponseEntity<Void> signUp(@Valid @RequestBody SignUpRequestDTO request) {
    authService.signUp(request);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @Operation(
      summary = "통합 로그인 API",
      description = """
          일반(PASSWORD) 및 간편인증(SIMPLE_PASSWORD, PATTERN, FACEID) 로그인을 처리합니다.
          실제 인증은 Spring Security Filter(CustomJsonLoginFilter)가 처리하며,
          이 메서드는 Swagger 문서화 전용입니다.
          """
  )
  @PostMapping("/login")
  public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
    throw new IllegalStateException("이 메서드는 Security Filter가 가로채야 합니다.");
  }

  @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 이용해 새로운 액세스 토큰을 발급한다.")
  @PostMapping("/refresh")
  public ResponseEntity<TokenResponseDTO> refresh(@RequestBody TokenResponseDTO request) {
    return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
  }

  @Operation(
      summary = "휴면 계정 해제 API",
      description = """
          본인인증(SMS) 완료 후 휴면 상태를 해제하고 새 비밀번호를 설정합니다.
          
          [인증 절차]
          1. SMS 인증번호 발송/확인 API를 통해 본인인증을 먼저 완료해야 합니다.
          2. 테스트 시 등록된 전화번호(01033334444)로 인증이 완료된 상태여야 요청이 성공합니다.
          3. 새 비밀번호 규칙: 영문+숫자 조합 8~16자 (특수문자 선택)
          """
  )
  @PostMapping("/unlock-dormant")
  public ResponseEntity<Void> unlockDormant(@Valid @RequestBody UnlockDormantRequestDTO request) {
    authService.unlockDormant(request);
    return ResponseEntity.ok().build();
  }

  @Operation(
      summary = "아이디 중복 체크",
      description = "회원가입 전 loginId 사용 가능 여부를 확인한다. 이미 사용 중이면 409를 반환한다."
  )
  @GetMapping("/check-id")
  public ApiResponse<String> checkLoginId(
      @Parameter(description = "중복 확인할 아이디 (영문·숫자 4~20자)", example = "hong1234")
      @RequestParam
      @LoginId
      String loginId) {
    authService.checkLoginId(loginId);
    return ApiResponse.onSuccess("사용 가능한 아이디입니다.");
  }

  @Operation(summary = "SMS 인증번호 발송", description = "입력한 전화번호로 6자리 인증번호를 슬랙으로 발송한다.")
  @PostMapping("/sms/send")
  public ResponseEntity<Void> sendSms(@Valid @RequestBody SmsRequestDTO request) {
    smsAuthService.sendAuthCode(request);
    return ResponseEntity.ok().build();
  }

  @Operation(
      summary = "비밀번호 찾기용 인증번호 발송",
      description = """
          아이디와 가입 전화번호가 일치하는 사용자를 확인한 후 6자리 인증번호를 발송합니다.
          발송된 인증번호는 POST /api/auth/sms/verify로 검증합니다.
          """
  )
  @ApiPasswordFindResponse
  @PostMapping("/sms/send/password-find")
  public ApiResponse<String> sendPasswordFindCode(
      @Valid @RequestBody PasswordFindRequestDTO request) {
    smsAuthService.sendPasswordFindCode(request);
    return ApiResponse.onSuccess("인증번호가 발송되었습니다.");
  }

  @Operation(
      summary = "SMS 인증번호 확인",
      description = """
          사용자가 입력한 6자리 인증번호를 검증합니다.
          성공 시 해당 번호는 5분간 '인증 완료' 상태로 유지되어 회원가입 시 참조됩니다.
          """
  )
  @ApiSmsVerifyResponse
  @PostMapping("/sms/verify")
  public ApiResponse<String> verifySms(@Valid @RequestBody SmsVerifyRequestDTO request) {
    smsAuthService.verifySms(request);
    return ApiResponse.onSuccess("인증에 성공하였습니다.");
  }
}
