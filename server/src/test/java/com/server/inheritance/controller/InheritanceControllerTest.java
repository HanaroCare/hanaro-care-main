package com.server.inheritance.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.inheritance.dto.InheritanceContextDTO;
import com.server.inheritance.dto.InheritanceRequestDTO;
import com.server.inheritance.dto.InheritanceResponseDTO;
import com.server.inheritance.service.InheritanceService;
import java.util.ArrayList;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(controllers = InheritanceController.class)
@AutoConfigureMockMvc(addFilters = false)
public class InheritanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InheritanceService inheritanceService;

    @MockitoBean
    private com.server.common.security.JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockitoBean
    private com.server.common.security.handler.CustomAccessDeniedHandler accessDeniedHandler;
    @MockitoBean
    private com.server.common.security.handler.LoginSuccessHandler loginSuccessHandler;
    @MockitoBean
    private com.server.common.security.handler.LoginFailureHandler loginFailureHandler;
    @MockitoBean
    private com.server.common.security.LoginAuthenticationProvider loginAuthenticationProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("상속 컨텍스트 조회 API 테스트")
    void getInheritanceContextTest() throws Exception {
        // given
        Long userId = 1L;
        InheritanceContextDTO context = InheritanceContextDTO.builder()
                .familyMembers(new ArrayList<>())
                .build();
        
        when(inheritanceService.getInheritanceContext(userId)).thenReturn(context);

        // when & then
        mockMvc.perform(get("/api/inheritance/context/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true));
    }

    @Test
    @DisplayName("상속 플랜 생성 API 테스트")
    void createOrUpdatePlanTest() throws Exception {
        // given
        Long userId = 1L;
        InheritanceRequestDTO request = InheritanceRequestDTO.builder()
                .distributions(new ArrayList<>())
                .build();
        
        InheritanceResponseDTO response = InheritanceResponseDTO.builder()
                .planId("1")
                .build();

        when(inheritanceService.createOrUpdatePlan(eq(userId), any(InheritanceRequestDTO.class))).thenReturn(response);

        // when & then
        mockMvc.perform(post("/api/inheritance/plan/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.planId").value("1"));
    }

    @Test
    @DisplayName("상속 플랜 요약 조회 API 테스트")
    void getPlanSummaryTest() throws Exception {
        // given
        Long userId = 1L;
        InheritanceResponseDTO response = InheritanceResponseDTO.builder()
                .planId("1")
                .build();

        when(inheritanceService.getPlanSummary(userId)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/inheritance/summary/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.planId").value("1"));
    }
}
