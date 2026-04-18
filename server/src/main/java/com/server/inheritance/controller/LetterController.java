package com.server.inheritance.controller;

import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.inheritance.dto.InheritanceSummaryDto;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.service.LetterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "상속 API", description = "상속 관련 API")
@RestController
@RequestMapping("/api/inheritance")
@RequiredArgsConstructor
public class LetterController {

  private final LetterService service;


  // 상속비율 및 가족 조회
  @Operation(summary = "상속비율 및 가족 조회", description = "상속 편지에서 상속비율 및 상속 설계된 가족을 조회합니다.")
  @GetMapping
  public ApiResponse<List<InheritanceSummaryDto>> getInheritanceInfo(@AuthenticationPrincipal SubscriberDTO user) {
    return ApiResponse.onSuccess(service.getInheritanceInfo(user.getUserId()));
  }

  // 상속 편지 생성
  @Operation(summary = "상속 편지 생성", description = "상속 편지를 작성합니다.")
  @PostMapping(value = "/letter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  ApiResponse<LetterResponseDto> sendLetter(
      @AuthenticationPrincipal SubscriberDTO user,
      @Valid @ModelAttribute @ParameterObject LetterRequestDto dto,
      @RequestPart(value = "voice", required = false) MultipartFile voice
  ) throws IOException {
    LetterResponseDto result = service.sendLetter(user.getUserId(), dto, voice);
    return ApiResponse.onSuccess(result);
  }

  // 상속 편지 조회
  @Operation(summary = "상속 편지 조회", description = "상속 편지를 조회합니다.")
  @GetMapping("/letter/{inheritDetailId}")
  ApiResponse<LetterResponseDto> getLetter(@AuthenticationPrincipal SubscriberDTO user,
      @Parameter(description = "가족 상세 ID", example = "1") @PathVariable String inheritDetailId) {
    LetterResponseDto letter = service.getLetter(user.getUserId(), Long.parseLong(inheritDetailId));
    return ApiResponse.onSuccess(letter);
  }

  // 상속 편지 삭제
  @Operation(summary = "상속 편지 삭제", description = "상속 편지를 삭제합니다.")
  @DeleteMapping("/letter/{inheritDetailId}")
  ApiResponse deleteLetter(@AuthenticationPrincipal SubscriberDTO user,
      @Parameter(description = "가족 상세 ID", example = "1") @PathVariable String inheritDetailId) {
    return ApiResponse.onSuccess(service.deleteLetter(user.getUserId(), Long.parseLong(inheritDetailId)));
  }

}
