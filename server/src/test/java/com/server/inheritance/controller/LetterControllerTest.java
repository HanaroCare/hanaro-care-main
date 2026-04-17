//package com.server.inheritance.controller;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.ArgumentMatchers.isNull;
//import static org.mockito.BDDMockito.given;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.server.common.security.dto.SubscriberDTO;
//import com.server.inheritance.dto.InheritanceSummaryDto;
//import com.server.inheritance.dto.LetterRequestDto;
//import com.server.inheritance.dto.LetterResponseDto;
//import com.server.inheritance.enums.LetterType;
//import com.server.inheritance.service.LetterService;
//import java.math.BigDecimal;
//import java.util.List;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Nested;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
//import org.springframework.test.web.servlet.MockMvc;
//
//@WebMvcTest(LetterController.class)
//class LetterControllerTest {
//
//  @Autowired
//  private MockMvc mockMvc;
//
//  @MockBean
//  private LetterService service;
//
//  @Autowired
//  private ObjectMapper objectMapper;
//
//  private SubscriberDTO mockUser;
//
//  @BeforeEach
//  void setUp() {
//    mockUser = SubscriberDTO.builder()
//        .i
//        .userNm("홍길동")
//        // UserDetails 필드 세팅 (SubscriberDTO 구조에 맞게 수정)
//        .build();
//  }
//
//  // ──────────────────────────────────────────────
//  // GET /api/inheritance
//  // ──────────────────────────────────────────────
//  @Nested
//  @DisplayName("GET /api/inheritance - 상속비율 및 가족 조회")
//  class GetInheritanceInfo {
//
//    @Test
//    @DisplayName("200 OK - 상속 요약 목록 반환")
//    void success() throws Exception {
//      List<InheritanceSummaryDto> response = List.of(
//          InheritanceSummaryDto.builder()
//              .inheritDetailId(10L)
//              .userId(2L)
//              .username("홍철수")
//              .percent(new BigDecimal("0.5"))
//              .amt(50_000_000L)
//              .build()
//      );
//      given(service.getInheritanceInfo(1L)).willReturn(response);
//
//      mockMvc.perform(get("/api/inheritance")
//              .with(SecurityMockMvcRequestPostProcessors.user(mockUser)))
//          .andDo(print())
//          .andExpect(status().isOk())
//          .andExpect(jsonPath("$[0].inheritDetailId").value(10))
//          .andExpect(jsonPath("$[0].username").value("홍철수"))
//          .andExpect(jsonPath("$[0].amt").value(50_000_000));
//    }
//
//    @Test
//    @DisplayName("401 Unauthorized - 인증 없이 접근")
//    void unauthorized() throws Exception {
//      mockMvc.perform(get("/api/inheritance"))
//          .andExpect(status().isUnauthorized());
//    }
//  }
//
//  // ──────────────────────────────────────────────
//  // POST /api/inheritance/letter
//  // ──────────────────────────────────────────────
//  @Nested
//  @DisplayName("POST /api/inheritance/letter - 편지 생성")
//  class SendLetter {
//
//    @Test
//    @DisplayName("200 OK - 텍스트 편지 생성")
//    void sendWritingLetter_success() throws Exception {
//      LetterResponseDto response = LetterResponseDto.builder()
//          .letterTypeCd(LetterType.WRITING)
//          .letterCont("사랑하는 아들에게")
//          .voiceUrl("")
//          .build();
//      given(service.sendLetter(eq(1L), any(LetterRequestDto.class), isNull()))
//          .willReturn(response);
//
//      mockMvc.perform(multipart("/api/inheritance/letter")
//              .param("inheritDetailId", "10")
//              .param("letterTypeCd", "WRITING")
//              .param("letterCont", "사랑하는 아들에게")
//              .with(SecurityMockMvcRequestPostProcessors.user(mockUser))
//              .with(csrf())
//              .contentType(MediaType.MULTIPART_FORM_DATA))
//          .andDo(print())
//          .andExpect(status().isOk())
//          .andExpect(jsonPath("$.result.letterTypeCd").value("WRITING"))
//          .andExpect(jsonPath("$.result.letterCont").value("사랑하는 아들에게"));
//    }
//
//    @Test
//    @DisplayName("200 OK - 음성 편지 생성 (파일 포함)")
//    void sendVoiceLetter_success() throws Exception {
//      MockMultipartFile voiceFile = new MockMultipartFile(
//          "voice", "test.webm", "audio/webm", "audio-data".getBytes());
//
//      LetterResponseDto response = LetterResponseDto.builder()
//          .letterTypeCd(LetterType.VOICE)
//          .voiceUrl("uuid-filename.webm")
//          .build();
//      given(service.sendLetter(eq(1L), any(LetterRequestDto.class), any()))
//          .willReturn(response);
//
//      mockMvc.perform(multipart("/api/inheritance/letter")
//              .file(voiceFile)
//              .param("inheritDetailId", "10")
//              .param("letterTypeCd", "VOICE")
//              .with(SecurityMockMvcRequestPostProcessors.user(mockUser))
//              .with(csrf())
//              .contentType(MediaType.MULTIPART_FORM_DATA))
//          .andDo(print())
//          .andExpect(status().isOk())
//          .andExpect(jsonPath("$.result.letterTypeCd").value("VOICE"))
//          .andExpect(jsonPath("$.result.voiceUrl").value("uuid-filename.webm"));
//    }
//
//    @Test
//    @DisplayName("400 Bad Request - inheritDetailId 누락")
//    void missingRequiredField() throws Exception {
//      mockMvc.perform(multipart("/api/inheritance/letter")
//              .param("letterTypeCd", "WRITING")
//              .param("letterCont", "내용")
//              .with(SecurityMockMvcRequestPostProcessors.user(mockUser))
//              .with(csrf())
//              .contentType(MediaType.MULTIPART_FORM_DATA))
//          .andExpect(status().isBadRequest());
//    }
//  }
//
//  // ──────────────────────────────────────────────
//  // GET /api/inheritance/letter/{inheritDetailId}
//  // ──────────────────────────────────────────────
//  @Nested
//  @DisplayName("GET /api/inheritance/letter/{inheritDetailId} - 편지 조회")
//  class GetLetter {
//
//    @Test
//    @DisplayName("200 OK - 텍스트 편지 조회")
//    void success() throws Exception {
//      LetterResponseDto response = LetterResponseDto.builder()
//          .letterTypeCd(LetterType.WRITING)
//          .letterCont("사랑하는 아들에게")
//          .voiceUrl("")
//          .build();
//      given(service.getLetter(1L, 10L)).willReturn(response);
//
//      mockMvc.perform(get("/api/inheritance/letter/10")
//              .with(SecurityMockMvcRequestPostProcessors.user(mockUser)))
//          .andDo(print())
//          .andExpect(status().isOk())
//          .andExpect(jsonPath("$.result.letterTypeCd").value("WRITING"))
//          .andExpect(jsonPath("$.result.letterCont").value("사랑하는 아들에게"));
//    }
//
//    @Test
//    @DisplayName("401 Unauthorized - 인증 없이 접근")
//    void unauthorized() throws Exception {
//      mockMvc.perform(get("/api/inheritance/letter/10"))
//          .andExpect(status().isUnauthorized());
//    }
//  }
//
//  // ──────────────────────────────────────────────
//  // DELETE /api/inheritance/letter/{inheritDetailId}
//  // ──────────────────────────────────────────────
//  @Nested
//  @DisplayName("DELETE /api/inheritance/letter/{inheritDetailId} - 편지 삭제")
//  class DeleteLetter {
//
//    @Test
//    @DisplayName("200 OK - 편지 삭제 성공, letterId 반환")
//    void success() throws Exception {
//      given(service.deleteLetter(1L, 10L)).willReturn(100L);
//
//      mockMvc.perform(delete("/api/inheritance/letter/10")
//              .with(SecurityMockMvcRequestPostProcessors.user(mockUser))
//              .with(csrf()))
//          .andDo(print())
//          .andExpect(status().isOk())
//          .andExpect(jsonPath("$.result").value(100));
//    }
//
//    @Test
//    @DisplayName("401 Unauthorized - 인증 없이 접근")
//    void unauthorized() throws Exception {
//      mockMvc.perform(delete("/api/inheritance/letter/10")
//              .with(csrf()))
//          .andExpect(status().isUnauthorized());
//    }
//  }
//}
