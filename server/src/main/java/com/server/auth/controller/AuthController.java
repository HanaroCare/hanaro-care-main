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
    return ResponseEntity.ok(authService.login(request));
  }

  @PostMapping("/refresh")
  public ResponseEntity<TokenResponseDTO> refresh(@RequestBody TokenResponseDTO request) {
    return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
  }
}
