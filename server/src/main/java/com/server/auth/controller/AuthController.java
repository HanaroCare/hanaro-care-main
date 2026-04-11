package com.server.auth.controller;

import com.server.auth.dto.LoginRequestDTO;
import com.server.auth.dto.TokenResponseDTO;
import com.server.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "로그인 API", description = "아이디/비번으로 Access/Refresh 토큰을 발급한다.")
  @PostMapping("/login")
  public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
    throw new IllegalStateException("이 메서드는 스프링 시큐리티 필터에 의해 처리되어야 합니다.");
  }

  @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 이용해 새로운 액세스 토큰을 발급한다.")
  @PostMapping("/refresh")
  public ResponseEntity<TokenResponseDTO> refresh(@RequestBody TokenResponseDTO request) {
    return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
  }
}
