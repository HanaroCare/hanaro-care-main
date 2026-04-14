package com.server.inheritance.controller;

import com.server.common.security.dto.SubscriberDTO;
import com.server.inheritance.dto.InheritanceSummaryDto;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.service.LetterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Inheritance", description = "상속 관련 API")
@RestController
@RequestMapping("/api/inheritance")
@RequiredArgsConstructor
public class LetterController {

  private final LetterService service;

  // 상속비율 및 가족 조회
  @Operation(summary = "상속비율 및 가족 조회", description = "상속 편지에서 상속비율 및 상속 설계된 가족을 조회합니다.")
  @GetMapping
  List<InheritanceSummaryDto> getInheritanceInfo(@AuthenticationPrincipal SubscriberDTO user) {
    return service.getInheritanceInfo(user.getUserId());
  }

  // 상속 편지 생성
  @Operation(summary = "상속 편지 생성", description = "상속 편지를 작성합니다. 음성 편지의 경우 voice 파일을 함께 전송합니다.")
  @PostMapping(value = "/letter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  ResponseEntity<?> sendLetter(@AuthenticationPrincipal SubscriberDTO user,
      @ModelAttribute LetterRequestDto dto)
      throws IOException {
    service.sendLetter(user.getUserId(), dto);
    return ResponseEntity.ok().build();
  }

  // 상속 편지 조회
  @Operation(summary = "상속 편지 조회", description = "상속 편지를 조회합니다.")
  @GetMapping("/letter/{familyId}")
  LetterResponseDto getLetter(@AuthenticationPrincipal SubscriberDTO user,
      @Parameter(description = "가족 상세 ID", example = "1") @PathVariable Long familyId) {
    return service.getLetter(user.getUserId(), familyId);
  }

}
