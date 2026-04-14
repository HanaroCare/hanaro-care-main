package com.server.inheritance.controller;

import com.server.common.security.dto.SubscriberDTO;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.service.LetterService;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inheritance/letter")
@RequiredArgsConstructor
public class LetterController {

  private final LetterService service;

  // TODO: 상속비율 및 가족 조회, 총 잔액 조회

  // 상속 편지 생성
  @PostMapping("/recipients")
  ResponseEntity<?> sendLetter(@AuthenticationPrincipal SubscriberDTO user, LetterRequestDto dto)
      throws IOException {
    service.sendLetter(user.getUserId(), dto);
    return ResponseEntity.ok().build();
  }

  // 상속 편지 조회
  @GetMapping("/recipients/{familyId}")
  LetterResponseDto getLetter(@AuthenticationPrincipal SubscriberDTO user,
      @PathVariable Long familyId) {
    return service.getLetter(user.getUserId(), familyId);
  }

}
