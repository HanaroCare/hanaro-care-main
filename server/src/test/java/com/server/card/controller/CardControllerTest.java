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
import org.springframework.boot.test.mock.mockito.MockBean;
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

    // @Getter 전용 DTO 역직렬화를 위해 Jackson 필드 가시성 허용
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

    @MockBean
    private CardService cardService;

    // SecurityConfig 의존성 해소용 Mock 빈
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean
    private CustomAccessDeniedHandler accessDeniedHandler;
    @MockBean
    private LoginSuccessHandler loginSuccessHandler;
    @MockBean
    private LoginFailureHandler loginFailureHandler;
    @MockBean
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
        // Spring Security 6.x: addFilters=false 환경에서 @AuthenticationPrincipal 주입을 위해
        // SecurityContextHolder에 직접 인증 정보 설정
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

    // ── POST /api/cards ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/cards - 카드 발급")
    class RegisterCard {

        private static final String REGISTER_JSON = """
                {
                    "accountId": 10,
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
                    .andExpect(jsonPath("$.result.cardNm").value("테스트 카드"))
                    .andExpect(jsonPath("$.result.designCd").value("A"));

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

        @Test
        @DisplayName("계좌 없을 시 서비스 예외 → 404 반환")
        void accountNotFound_returnsError() throws Exception {
            when(cardService.registerCard(eq(USER_ID), any()))
                    .thenThrow(new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

            mockMvc.perform(post("/api/cards")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(REGISTER_JSON))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("ACCOUNT_404"));
        }

        @Test
        @DisplayName("필수 필드 누락 시 400 반환 (Bean Validation)")
        void missingRequiredFields_returns400() throws Exception {
            mockMvc.perform(post("/api/cards")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    // ── PATCH /api/cards/{cardId}/settings ────────────────────────────────────

    @Nested
    @DisplayName("PATCH /api/cards/{cardId}/settings - 카드 설정 변경")
    class UpdateCard {

        private static final String UPDATE_JSON = """
                {
                    "accountId": 10,
                    "autoTransAmt": 100000,
                    "payDay": 20
                }
                """;

        @Test
        @DisplayName("카드 설정 변경 성공 - 200 OK, isSuccess=true")
        void success() throws Exception {
            when(cardService.updateCard(eq(USER_ID), eq(CARD_ID), any())).thenReturn(testCard);

            mockMvc.perform(patch("/api/cards/{cardId}/settings", CARD_ID)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(UPDATE_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result.cardId").value(CARD_ID.toString()));

            verify(cardService).updateCard(eq(USER_ID), eq(CARD_ID), any());
        }

        @Test
        @DisplayName("카드 없을 시 서비스 예외 → 404 반환")
        void cardNotFound_returnsError() throws Exception {
            when(cardService.updateCard(eq(USER_ID), eq(CARD_ID), any()))
                    .thenThrow(new ApiException(ErrorStatus.CARD_NOT_FOUND));

            mockMvc.perform(patch("/api/cards/{cardId}/settings", CARD_ID)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(UPDATE_JSON))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_404"));
        }

        @Test
        @DisplayName("CASH 아닌 계좌 사용 시 서비스 예외 → 400 반환")
        void accountNotCash_returnsError() throws Exception {
            when(cardService.updateCard(eq(USER_ID), eq(CARD_ID), any()))
                    .thenThrow(new ApiException(ErrorStatus.ACCOUNT_NOT_CASH));

            mockMvc.perform(patch("/api/cards/{cardId}/settings", CARD_ID)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(UPDATE_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("ACCOUNT_401"));
        }

        @Test
        @DisplayName("타인 계좌 사용 시 서비스 예외 → 403 반환")
        void accountForbidden_returnsError() throws Exception {
            when(cardService.updateCard(eq(USER_ID), eq(CARD_ID), any()))
                    .thenThrow(new ApiException(ErrorStatus.ACCOUNT_FORBIDDEN));

            mockMvc.perform(patch("/api/cards/{cardId}/settings", CARD_ID)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(UPDATE_JSON))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.isSuccess").value(false));
        }
    }

    // ── PATCH /api/cards/{cardId}/cancel ──────────────────────────────────────

    @Nested
    @DisplayName("PATCH /api/cards/{cardId}/cancel - 카드 해지")
    class CancelCard {

        @Test
        @DisplayName("카드 해지 성공 - 200 OK, result=null")
        void success() throws Exception {
            doNothing().when(cardService).cancelCard(USER_ID, CARD_ID);

            mockMvc.perform(patch("/api/cards/{cardId}/cancel", CARD_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true));

            verify(cardService).cancelCard(USER_ID, CARD_ID);
        }

        @Test
        @DisplayName("접근 권한 없을 시 서비스 예외 → 403 반환")
        void cardForbidden_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.CARD_FORBIDDEN))
                    .when(cardService).cancelCard(USER_ID, CARD_ID);

            mockMvc.perform(patch("/api/cards/{cardId}/cancel", CARD_ID))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_403"));
        }

        @Test
        @DisplayName("카드 없을 시 서비스 예외 → 404 반환")
        void cardNotFound_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.CARD_NOT_FOUND))
                    .when(cardService).cancelCard(USER_ID, CARD_ID);

            mockMvc.perform(patch("/api/cards/{cardId}/cancel", CARD_ID))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.isSuccess").value(false));
        }
    }

    // ── GET /api/cards/accounts ───────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/cards/accounts - 충전 계좌 목록")
    class GetCashAccounts {

        @Test
        @DisplayName("계좌 목록 조회 성공 - 200 OK, 리스트 반환")
        void success() throws Exception {
            AccountListResponse account = AccountListResponse.builder()
                    .accountId(ACCOUNT_ID).instNm("하나은행")
                    .accountNum("123-456-789").balanceAmt(new BigDecimal("500000"))
                    .build();
            when(cardService.getCashAccounts(USER_ID)).thenReturn(List.of(account));

            mockMvc.perform(get("/api/cards/accounts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result[0].accountId").value(ACCOUNT_ID))
                    .andExpect(jsonPath("$.result[0].instNm").value("하나은행"));

            verify(cardService).getCashAccounts(USER_ID);
        }

        @Test
        @DisplayName("계좌 없을 시 빈 리스트 반환")
        void emptyList() throws Exception {
            when(cardService.getCashAccounts(USER_ID)).thenReturn(Collections.emptyList());

            mockMvc.perform(get("/api/cards/accounts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result").isArray())
                    .andExpect(jsonPath("$.result").isEmpty());
        }
    }

    // ── GET /api/cards/{cardId}/usages ────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/cards/{cardId}/usages - 카드 사용 내역")
    class GetCardUsages {

        @Test
        @DisplayName("사용 내역 조회 성공 - 200 OK, 리스트 반환")
        void success() throws Exception {
            CardUsageResponse usage = CardUsageResponse.builder()
                    .cardUsageId(String.valueOf(USAGE_ID))
                    .cardId(String.valueOf(CARD_ID))
                    .usageNm("편의점").usageTypeCd("SPEND")
                    .usageAmt(new BigDecimal("5000"))
                    .abnmlYn("N").aprvlYn("Y")
                    .build();
            when(cardService.getCardUsages(USER_ID, CARD_ID)).thenReturn(List.of(usage));

            mockMvc.perform(get("/api/cards/{cardId}/usages", CARD_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result[0].usageNm").value("편의점"))
                    .andExpect(jsonPath("$.result[0].usageAmt").value(5000));

            verify(cardService).getCardUsages(USER_ID, CARD_ID);
        }

        @Test
        @DisplayName("카드 없을 시 서비스 예외 → 404 반환")
        void cardNotFound_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.CARD_NOT_FOUND))
                    .when(cardService).getCardUsages(USER_ID, CARD_ID);

            mockMvc.perform(get("/api/cards/{cardId}/usages", CARD_ID))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_404"));
        }

        @Test
        @DisplayName("접근 권한 없을 시 서비스 예외 → 403 반환")
        void cardForbidden_returnsError() throws Exception {
            when(cardService.getCardUsages(USER_ID, CARD_ID))
                    .thenThrow(new ApiException(ErrorStatus.CARD_FORBIDDEN));

            mockMvc.perform(get("/api/cards/{cardId}/usages", CARD_ID))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.isSuccess").value(false));
        }
    }

    // ── GET /api/cards/family ─────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/cards/family - 가족 목록 조회")
    class GetFamilyMembers {

        @Test
        @DisplayName("가족 목록 조회 성공 - 200 OK, 구성원 정보 포함")
        void success() throws Exception {
            FamilyMemberResponse member = FamilyMemberResponse.builder()
                    .familyAuthId("300").granteeId("2")
                    .userNm("자녀").relationCd(FamilyRelation.CHILD.name())
                    .build();
            when(cardService.getFamilyMembers(USER_ID)).thenReturn(List.of(member));

            mockMvc.perform(get("/api/cards/family"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result[0].userNm").value("자녀"))
                    .andExpect(jsonPath("$.result[0].relationCd").value("CHILD"));

            verify(cardService).getFamilyMembers(USER_ID);
        }

        @Test
        @DisplayName("가족 없을 시 빈 리스트 반환")
        void emptyList() throws Exception {
            when(cardService.getFamilyMembers(USER_ID)).thenReturn(Collections.emptyList());

            mockMvc.perform(get("/api/cards/family"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.result").isEmpty());
        }
    }

    // ── GET /api/cards ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/cards - 내 카드 목록")
    class GetMyCards {

        @Test
        @DisplayName("내 카드 목록 조회 성공 - 200 OK")
        void success() throws Exception {
            CardRegisterResponse card = CardRegisterResponse.builder()
                    .cardId(String.valueOf(CARD_ID)).cardNm("테스트 카드")
                    .designCd("A").limitAmt(new BigDecimal("1000000"))
                    .autoTransAmt(BigDecimal.ZERO).isUse(true).payDay(15)
                    .build();
            when(cardService.getMyCards(USER_ID)).thenReturn(List.of(card));

            mockMvc.perform(get("/api/cards"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result[0].cardId").value(CARD_ID.toString()))
                    .andExpect(jsonPath("$.result[0].cardNm").value("테스트 카드"));

            verify(cardService).getMyCards(USER_ID);
        }

        @Test
        @DisplayName("카드 없을 시 빈 리스트 반환")
        void noCards() throws Exception {
            when(cardService.getMyCards(USER_ID)).thenReturn(Collections.emptyList());

            mockMvc.perform(get("/api/cards"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.result").isEmpty());
        }
    }

    // ── POST /api/cards/charge ────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/cards/charge - 카드 충전")
    class ChargeCard {

        private static final String CHARGE_JSON = """
                {
                    "cardId": "100",
                    "accountId": 10,
                    "chargeAmt": 50000
                }
                """;

        @Test
        @DisplayName("카드 충전 성공 - 200 OK, result=null")
        void success() throws Exception {
            doNothing().when(cardService).chargeCard(eq(USER_ID), any());

            mockMvc.perform(post("/api/cards/charge")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(CHARGE_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true));

            verify(cardService).chargeCard(eq(USER_ID), any());
        }

        @Test
        @DisplayName("카드 비활성화 시 서비스 예외 → 400 반환")
        void cardDisabled_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.CARD_DISABLED))
                    .when(cardService).chargeCard(eq(USER_ID), any());

            mockMvc.perform(post("/api/cards/charge")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(CHARGE_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_400"));
        }

        @Test
        @DisplayName("잔액 한도 초과 시 서비스 예외 → 400 반환")
        void balanceExceeded_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.CARD_BALANCE_EXCEEDED))
                    .when(cardService).chargeCard(eq(USER_ID), any());

            mockMvc.perform(post("/api/cards/charge")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(CHARGE_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_401"));
        }

        @Test
        @DisplayName("계좌 잔액 부족 시 서비스 예외 → 400 반환")
        void insufficientBalance_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.ACCOUNT_INSUFFICIENT))
                    .when(cardService).chargeCard(eq(USER_ID), any());

            mockMvc.perform(post("/api/cards/charge")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(CHARGE_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("ACCOUNT_402"));
        }

        @Test
        @DisplayName("필수 필드 누락 시 400 반환 (Bean Validation)")
        void missingRequiredFields_returns400() throws Exception {
            mockMvc.perform(post("/api/cards/charge")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    // ── GET /api/cards/{cardId}/balance ───────────────────────────────────────

    @Nested
    @DisplayName("GET /api/cards/{cardId}/balance - 카드 잔액 조회")
    class GetCardBalance {

        @Test
        @DisplayName("카드 잔액 조회 성공 - 200 OK, 잔액 반환")
        void success() throws Exception {
            when(cardService.getCardBalance(USER_ID, CARD_ID))
                    .thenReturn(new BigDecimal("123000"));

            mockMvc.perform(get("/api/cards/{cardId}/balance", CARD_ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isSuccess").value(true))
                    .andExpect(jsonPath("$.result").value(123000));

            verify(cardService).getCardBalance(USER_ID, CARD_ID);
        }

        @Test
        @DisplayName("카드 없을 시 서비스 예외 → 404 반환")
        void cardNotFound_returnsError() throws Exception {
            doThrow(new ApiException(ErrorStatus.CARD_NOT_FOUND))
                    .when(cardService).getCardBalance(USER_ID, CARD_ID);

            mockMvc.perform(get("/api/cards/{cardId}/balance", CARD_ID))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_404"));
        }

        @Test
        @DisplayName("접근 권한 없을 시 서비스 예외 → 403 반환")
        void cardForbidden_returnsError() throws Exception {
            when(cardService.getCardBalance(USER_ID, CARD_ID))
                    .thenThrow(new ApiException(ErrorStatus.CARD_FORBIDDEN));

            mockMvc.perform(get("/api/cards/{cardId}/balance", CARD_ID))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_403"));
        }
    }

    // ── GET /api/cards/usages/{usageId} ───────────────────────────────────────

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
                    .andExpect(jsonPath("$.result.usageNm").value("마트"))
                    .andExpect(jsonPath("$.result.usageAmt").value(15000));

            verify(cardService).getCardUsage(USER_ID, USAGE_ID);
        }

        @Test
        @DisplayName("사용 내역 없을 시 서비스 예외 → 404 반환")
        void usageNotFound_returnsError() throws Exception {
            when(cardService.getCardUsage(USER_ID, USAGE_ID))
                    .thenThrow(new ApiException(ErrorStatus.CARD_NOT_FOUND));

            mockMvc.perform(get("/api/cards/usages/{usageId}", USAGE_ID))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.isSuccess").value(false))
                    .andExpect(jsonPath("$.code").value("CARD_404"));
        }
    }
}
