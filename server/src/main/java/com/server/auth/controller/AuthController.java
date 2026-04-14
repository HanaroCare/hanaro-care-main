package com.server.auth.controller;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.SignUpRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.dto.UnlockDormantRequestDTO;
import com.server.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "회원가입 API", description = "신규 회원을 등록한다.")
  @PostMapping("/signup")
  public ResponseEntity<Void> signUp(@Valid @RequestBody SignUpRequestDTO request) {
    authService.signUp(request);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @Operation(
      summary = "통합 로그인 API",
      description = "일반(PASSWORD) 및 간편인증(SIMPLE_PASSWORD, PATTERN, FACEID) 로그인을 통합 처리합니다."
  )
  @PostMapping("/login")
  public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 이용해 새로운 액세스 토큰을 발급한다.")
  @PostMapping("/refresh")
  public ResponseEntity<TokenResponseDTO> refresh(@RequestBody TokenResponseDTO request) {
    return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
  }

  @Operation(
      summary = "휴면 계정 해제 API",
      description = "본인인증 완료 후 휴면 상태를 해제하고 새 비밀번호를 설정한다."
  )
  @PostMapping("/unlock-dormant")
  public ResponseEntity<Void> unlockDormant(@Valid @RequestBody UnlockDormantRequestDTO request) {
    authService.unlockDormant(request);
    return ResponseEntity.ok().build();
  }
}
