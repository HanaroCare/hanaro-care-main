package com.server.inheritance.controller;

import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.service.LetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inheritance/letter")
@RequiredArgsConstructor
public class LetterController {

  private final LetterService service;


  // 상속 편지 생성
  @PostMapping("/recipients")
  void sendLetter(@AuthenticationPrincipal AuthPrincipal me, LetterRequestDto dto) {
    return service.sendLetter(me.getId(), dto);
  }

  // 상속 편지 조회
  @GetMapping("/recipients/{familyId}")
  LetterResponseDto getLetter(@PathVariable Long familyId) {
    return service.getLetter(@AuthenticationPrincipal AuthPrincipal me, familyId);
  }

}
