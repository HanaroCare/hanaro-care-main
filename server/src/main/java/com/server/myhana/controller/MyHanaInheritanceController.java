package com.server.myhana.controller;

import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.ContractDto;
import com.server.myhana.dto.FamilySummaryDto;
import com.server.myhana.service.MyHanaInheritanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "마이하나 API", description = "마이하나 API 입니다.")
@RestController
@RequestMapping("/myhana/inheritance")
@RequiredArgsConstructor
public class MyHanaInheritanceController {

  private final MyHanaInheritanceService myHanaInheritanceService;

  // 가족 조회
  @Operation(summary = "후견인 가족 조회", description = "후견인으로 선택할 가족을 조회합니다.")
  @GetMapping("/family")
  List<FamilySummaryDto> getFamily(@AuthenticationPrincipal SubscriberDTO user) {
    return myHanaInheritanceService.getFamily(user.getUserId());
  }

  // 계약서 생성하기
  @Operation(summary = "임의후견인 문서 생성", description = "입력 값을 문서에 작성하여 생성합니다.")
  @PostMapping("/contract")
  ResponseEntity<byte[]> downloadContract(@AuthenticationPrincipal SubscriberDTO user,
      @Valid @RequestBody ContractDto dto) throws Exception {
    byte[] file = myHanaInheritanceService.generateContract(user, dto);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contract.docx")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(file);
  }

}
