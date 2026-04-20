package com.server.card.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.card.dto.response.AccountListResponse;
import com.server.card.dto.response.CardRegisterResponse;
import com.server.card.dto.response.CardUsageResponse;
import com.server.card.dto.response.FamilyMemberResponse;
import com.server.card.entity.TBCard;
import com.server.card.service.CardService;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.JwtAuthenticationFilter;
import com.server.common.security.LoginAuthenticationProvider;
import com.server.common.security.dto.SubscriberDTO;
import com.server.common.security.handler.CustomAccessDeniedHandler;
import com.server.common.security.handler.LoginFailureHandler;
import com.server.common.security.handler.LoginSuccessHandler;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = CardController.class)
@AutoConfigureMockMvc(addFilters = false)
class CardControllerTest {

    @TestConfiguration
    static class TestJacksonConfig {
        @Bean
        @Primary
        ObjectMapper objectMapper() {
            ObjectMapper mapper = new ObjectMapper();
            mapper.setVisibility(mapper.getSerializationConfig().getDefaultVisibilityChecker()
                    .withFieldVisibility(com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.ANY)
                    .withGetterVisibility(com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.PUBLIC_ONLY)
                    .withSetterVisibility(com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.PUBLIC_ONLY)
                    .withCreatorVisibility(com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.ANY));
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            return mapper;
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CardService cardService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockitoBean
    private CustomAccessDeniedHandler accessDeniedHandler;
    @MockitoBean
    private LoginSuccessHandler loginSuccessHandler;
    @MockitoBean
    private LoginFailureHandler loginFailureHandler;
    @MockitoBean
    private LoginAuthenticationProvider loginAuthenticationProvider;

    private static final Long USER_ID = 1L;
    private static final Long CARD_ID = 100L;
    private static final Long ACCOUNT_ID = 10L;
    private static final Long USAGE_ID = 200L;

    private TBUser ownerUser;
    private TBAccount cashAccount;
    private TBCard testCard;

    @BeforeEach
    void setUp() {
        SubscriberDTO subscriberDTO = new SubscriberDTO(
                USER_ID, "owner", "홍길동", "password", false,
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        subscriberDTO, null, subscriberDTO.getAuthorities()));

        ownerUser = TBUser.builder()
                .userId(USER_ID).userNm("홍길동").loginId("owner")
                .userAge(45).userPhone("01012345678").userPwd("pwd")
                .build();

        cashAccount = TBAccount.builder()
                .accountId(ACCOUNT_ID).user(ownerUser)
                .assetCateCd(AssetCategory.CASH)
                .balanceAmt(new BigDecimal("500000"))
                .instNm("하나은행").accountNm("입출금").accountNum("123-456-789")
                .build();

        testCard = TBCard.builder()
                .cardId(CARD_ID).cardNm("A::테스트 카드")
                .account(cashAccount).isUse(true)
                .balanceAmt(BigDecimal.ZERO)
                .limitAmt(new BigDecimal("1000000"))
                .autoTransAmt(BigDecimal.ZERO)
                .payDay(15)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("POST /api/cards - 카드 발급")
    class RegisterCard {

        private static final String REGISTER_JSON = """
                {
                    "accountId": "10",
                    "cardNm": "내 카드",
                    "limitAmt": 500000,
                    "designCd": "A",
                    "payDay": 15
                }
                """;

        @Test
        @DisplayName("카드 발급 성공 - 200 OK, isSuccess=true, cardId 반환")
        void success() throws Exception {
            when(cardService.registerCard(eq(USER_ID), any())).thenReturn(testCard);

            mockMvc.perform(post("/api/cards")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(REGISTER_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result.cardId").value(CARD_ID.toString()))
                    .andExpect(jsonPath("$.result.cardNm").value("테스트 카드"));

            verify(cardService).registerCard(eq(USER_ID), any());
        }

        @Test
        @DisplayName("한도 초과 시 서비스 예외 → 400 반환")
        void limitExceeded_returnsError() throws Exception {
            when(cardService.registerCard(eq(USER_ID), any()))
                    .thenThrow(new ApiException(ErrorStatus.CARD_LIMIT_EXCEEDED));

            mockMvc.perform(post("/api/cards")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(REGISTER_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_403"));
        }
    }

    @Nested
    @DisplayName("GET /api/cards/accounts - 충전 계좌 목록")
    class GetCashAccounts {

        @Test
        @DisplayName("계좌 목록 조회 성공 - 200 OK, 리스트 반환")
        void success() throws Exception {
            AccountListResponse account = AccountListResponse.builder()
                    .accountId(String.valueOf(ACCOUNT_ID)).instNm("하나은행")
                    .accountNum("123-456-789").balanceAmt(new BigDecimal("500000"))
                    .build();
            when(cardService.getCashAccounts(USER_ID)).thenReturn(List.of(account));

            mockMvc.perform(get("/api/cards/accounts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result[0].accountId").value(String.valueOf(ACCOUNT_ID)))
                    .andExpect(jsonPath("$.result[0].instNm").value("하나은행"));

            verify(cardService).getCashAccounts(USER_ID);
        }
    }

    @Nested
    @DisplayName("GET /api/cards/usages/{usageId} - 단건 사용 내역 조회")
    class GetCardUsage {

        @Test
        @DisplayName("단건 사용 내역 조회 성공 - 200 OK")
        void success() throws Exception {
            CardUsageResponse usage = CardUsageResponse.builder()
                    .cardUsageId(String.valueOf(USAGE_ID))
                    .cardId(String.valueOf(CARD_ID))
                    .usageNm("마트").usageTypeCd("SPEND")
                    .usageAmt(new BigDecimal("15000"))
                    .abnmlYn("N").aprvlYn("Y")
                    .build();
            when(cardService.getCardUsage(USER_ID, USAGE_ID)).thenReturn(usage);

            mockMvc.perform(get("/api/cards/usages/{usageId}", USAGE_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result.cardUsageId").value(USAGE_ID.toString()))
                    .andExpect(jsonPath("$.result.usageNm").value("마트"));

            verify(cardService).getCardUsage(USER_ID, USAGE_ID);
        }
    }
}
