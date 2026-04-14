package com.server.myhana.controller;

import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.ContractDto;
import com.server.myhana.service.InheritanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/myhana/inheritance")
@RequiredArgsConstructor
public class InheritanceController {

  private final InheritanceService inheritanceService;

  // TODO: 가족 조회
  // TODO: 계약서 생성하기
  @GetMapping("/contract")
  public ResponseEntity<byte[]> downloadContract(@AuthenticationPrincipal SubscriberDTO user,
      @RequestBody ContractDto dto) throws Exception {
    byte[] file = inheritanceService.generateContract(dto);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contract.docx")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(file);
  }

}
