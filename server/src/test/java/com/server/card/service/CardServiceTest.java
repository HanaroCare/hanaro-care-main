package com.server.card.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.AccountRepository;
import com.server.card.dto.request.CardChargeRequest;
import com.server.card.dto.request.CardRegisterRequest;
import com.server.card.dto.request.CardUpdateRequest;
import com.server.card.dto.response.AccountListResponse;
import com.server.card.dto.response.CardRegisterResponse;
import com.server.card.dto.response.CardUsageResponse;
import com.server.card.dto.response.FamilyMemberResponse;
import com.server.card.entity.TBCard;
import com.server.card.entity.TBCardUsage;
import com.server.card.repository.CardRepository;
import com.server.card.repository.CardUsageRepository;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.FamilyAuthRepository;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock
    private CardRepository cardRepository;
    @Mock
    private CardUsageRepository cardUsageRepository;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private FamilyAuthRepository familyAuthRepository;

    @InjectMocks
    private CardService cardService;

    private static final Long OWNER_ID = 1L;
    private static final Long UNAUTHORIZED_ID = 99L;
    private static final Long FAMILY_USER_ID = 2L;
    private static final Long CARD_ID = 100L;
    private static final Long ACCOUNT_ID = 10L;
    private static final Long USAGE_ID = 200L;
    private static final Long FAMILY_AUTH_ID = 300L;

    private TBUser ownerUser;
    private TBAccount cashAccount;
    private TBCard activeCard;
    private TBCardUsage cardUsage;

    @BeforeEach
    void setUp() {
        ownerUser = TBUser.builder()
                .userId(OWNER_ID)
                .userNm("홍길동")
                .loginId("owner")
                .userAge(45)
                .userPhone("01012345678")
                .userPwd("encoded_pwd")
                .build();

        cashAccount = TBAccount.builder()
                .accountId(ACCOUNT_ID)
                .user(ownerUser)
                .assetCateCd(AssetCategory.CASH)
                .balanceAmt(new BigDecimal("500000"))
                .instNm("하나은행")
                .accountNm("입출금")
                .accountNum("123-456-789")
                .build();

        activeCard = TBCard.builder()
                .cardId(CARD_ID)
                .cardNm("A::테스트 카드")
                .account(cashAccount)
                .isUse(true)
                .balanceAmt(BigDecimal.ZERO)
                .limitAmt(new BigDecimal("1000000"))
                .autoTransAmt(BigDecimal.ZERO)
                .payDay(15)
                .build();

        cardUsage = TBCardUsage.builder()
                .cardUsageId(USAGE_ID)
                .card(activeCard)
                .usageNm("편의점")
                .usageTypeCd(TBCardUsage.UsageType.SPEND)
                .usageAmt(new BigDecimal("5000"))
                .abnmlYn("N")
                .aprvlYn("Y")
                .build();
    }

    // ── Fixture factories ──────────────────────────────────────────────────────

    private CardRegisterRequest registerRequest(BigDecimal limitAmt, BigDecimal autoTransAmt,
            List<String> familyAuthIds) {
        CardRegisterRequest req = new CardRegisterRequest();
        ReflectionTestUtils.setField(req, "accountId", String.valueOf(ACCOUNT_ID));
        ReflectionTestUtils.setField(req, "cardNm", "내 카드");
        ReflectionTestUtils.setField(req, "limitAmt", limitAmt);
        ReflectionTestUtils.setField(req, "autoTransAmt", autoTransAmt);
        ReflectionTestUtils.setField(req, "designCd", "A");
        ReflectionTestUtils.setField(req, "familyAuthIds", familyAuthIds);
        ReflectionTestUtils.setField(req, "payDay", 15);
        return req;
    }

    private CardUpdateRequest updateRequest(Integer payDay) {
        CardUpdateRequest req = new CardUpdateRequest();
        ReflectionTestUtils.setField(req, "accountId", String.valueOf(ACCOUNT_ID));
        ReflectionTestUtils.setField(req, "autoTransAmt", new BigDecimal("100000"));
        ReflectionTestUtils.setField(req, "payDay", payDay);
        return req;
    }

    private CardChargeRequest chargeRequest(BigDecimal amount) {
        CardChargeRequest req = new CardChargeRequest();
        ReflectionTestUtils.setField(req, "cardId", String.valueOf(CARD_ID));
        ReflectionTestUtils.setField(req, "accountId", String.valueOf(ACCOUNT_ID));
        ReflectionTestUtils.setField(req, "chargeAmt", amount);
        return req;
    }

    private void stubCardFoundAsOwner() {
        when(cardRepository.findById(CARD_ID)).thenReturn(Optional.of(activeCard));
    }

    private void stubFamilyAuthEmpty(Long userId) {
        when(familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(userId))
                .thenReturn(Collections.emptyList());
    }

    // ── registerCard ──────────────────────────────────────────────────────────

    @Nested
    @DisplayName("registerCard")
    class RegisterCard {

        @Test
        @DisplayName("한도 초과 시 CARD_LIMIT_EXCEEDED 발생")
        void limitExceeded_throwsException() {
            assertThatThrownBy(
                    () -> cardService.registerCard(OWNER_ID,
                            registerRequest(new BigDecimal("2000001"), null, null)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_LIMIT_EXCEEDED.getMessage());
        }

        @Test
        @DisplayName("계좌 없으면 ACCOUNT_NOT_FOUND 발생")
        void accountNotFound_throwsException() {
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(
                    () -> cardService.registerCard(OWNER_ID,
                            registerRequest(new BigDecimal("500000"), null, null)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("타인 계좌 사용 시 ACCOUNT_FORBIDDEN 발생")
        void accountForbidden_throwsException() {
            TBAccount otherAccount = TBAccount.builder()
                    .accountId(ACCOUNT_ID)
                    .user(TBUser.builder().userId(UNAUTHORIZED_ID).build())
                    .assetCateCd(AssetCategory.CASH)
                    .balanceAmt(BigDecimal.ZERO).instNm("x").accountNm("x").accountNum("x")
                    .build();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(otherAccount));

            assertThatThrownBy(
                    () -> cardService.registerCard(OWNER_ID,
                            registerRequest(new BigDecimal("500000"), null, null)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("autoTransAmt null이면 ZERO로 설정되어 등록 성공")
        void autoTransAmtNull_defaultsToZero() {
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(cashAccount));
            when(cardRepository.save(any(TBCard.class))).thenAnswer(inv -> inv.getArgument(0));

            TBCard result = cardService.registerCard(OWNER_ID,
                    registerRequest(new BigDecimal("500000"), null, null));

            assertThat(result.getAutoTransAmt()).isEqualByComparingTo(BigDecimal.ZERO);
            verify(familyAuthRepository, never()).findAllById(any());
        }

        @Test
        @DisplayName("autoTransAmt 지정하여 카드 등록 성공")
        void success_withAutoTransAmt() {
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(cashAccount));
            when(cardRepository.save(any(TBCard.class))).thenReturn(activeCard);

            TBCard result = cardService.registerCard(OWNER_ID,
                    registerRequest(new BigDecimal("500000"), new BigDecimal("50000"), null));

            assertThat(result).isEqualTo(activeCard);
            verify(cardRepository).save(any(TBCard.class));
        }

        @Test
        @DisplayName("가족 공유 포함 카드 등록 성공")
        void success_withFamilyAuth() {
            TBUser familyUser = TBUser.builder().userId(FAMILY_USER_ID).userNm("자녀").build();
            TBFamilyAuth existingAuth = TBFamilyAuth.builder()
                    .familyAuthId(FAMILY_AUTH_ID)
                    .grantor(ownerUser)
                    .grantee(familyUser)
                    .relationCd(FamilyRelation.CHILD)
                    .isCardView(false)
                    .build();

            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(cashAccount));
            when(cardRepository.save(any(TBCard.class))).thenReturn(activeCard);
            when(familyAuthRepository.findAllById(List.of(FAMILY_AUTH_ID)))
                    .thenReturn(List.of(existingAuth));
            when(familyAuthRepository.saveAll(anyList())).thenReturn(Collections.emptyList());

            TBCard result = cardService.registerCard(OWNER_ID,
                    registerRequest(new BigDecimal("500000"), null, List.of(String.valueOf(FAMILY_AUTH_ID))));

            assertThat(result).isEqualTo(activeCard);
            verify(familyAuthRepository).saveAll(anyList());
        }
    }

    // ── updateCard ────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("updateCard")
    class UpdateCard {

        @Test
        @DisplayName("카드 없으면 CARD_NOT_FOUND 발생")
        void cardNotFound_throwsException() {
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.updateCard(OWNER_ID, CARD_ID, updateRequest(15)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("접근 권한 없으면 CARD_FORBIDDEN 발생")
        void cardForbidden_throwsException() {
            stubCardFoundAsOwner();
            stubFamilyAuthEmpty(UNAUTHORIZED_ID);

            assertThatThrownBy(() -> cardService.updateCard(UNAUTHORIZED_ID, CARD_ID, updateRequest(15)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("계좌 없으면 ACCOUNT_NOT_FOUND 발생")
        void accountNotFound_throwsException() {
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.updateCard(OWNER_ID, CARD_ID, updateRequest(15)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("타인 계좌 사용 시 ACCOUNT_FORBIDDEN 발생")
        void accountForbidden_throwsException() {
            TBAccount otherAccount = TBAccount.builder()
                    .accountId(ACCOUNT_ID)
                    .user(TBUser.builder().userId(UNAUTHORIZED_ID).build())
                    .assetCateCd(AssetCategory.CASH)
                    .balanceAmt(BigDecimal.ZERO).instNm("x").accountNm("x").accountNum("x")
                    .build();
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(otherAccount));

            assertThatThrownBy(() -> cardService.updateCard(OWNER_ID, CARD_ID, updateRequest(15)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("CASH 아닌 계좌 사용 시 ACCOUNT_NOT_CASH 발생")
        void accountNotCash_throwsException() {
            TBAccount stockAccount = TBAccount.builder()
                    .accountId(ACCOUNT_ID).user(ownerUser)
                    .assetCateCd(AssetCategory.STOCK)
                    .balanceAmt(BigDecimal.ZERO).instNm("x").accountNm("x").accountNum("x")
                    .build();
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(stockAccount));

            assertThatThrownBy(() -> cardService.updateCard(OWNER_ID, CARD_ID, updateRequest(15)))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_NOT_CASH.getMessage());
        }

        @Test
        @DisplayName("payDay 포함 카드 수정 성공")
        void success_withPayDay() {
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(cashAccount));
            when(cardRepository.save(activeCard)).thenReturn(activeCard);

            TBCard result = cardService.updateCard(OWNER_ID, CARD_ID, updateRequest(20));

            assertThat(result.getPayDay()).isEqualTo(20);
            verify(cardRepository).save(activeCard);
        }

        @Test
        @DisplayName("payDay null이면 기존 값 유지하며 수정 성공")
        void success_payDayNull_preservesOriginal() {
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(cashAccount));
            when(cardRepository.save(activeCard)).thenReturn(activeCard);

            cardService.updateCard(OWNER_ID, CARD_ID, updateRequest(null));

            assertThat(activeCard.getPayDay()).isEqualTo(15);
        }
    }

    // ── cancelCard ────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("cancelCard")
    class CancelCard {

        @Test
        @DisplayName("카드 없으면 CARD_NOT_FOUND 발생")
        void cardNotFound_throwsException() {
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.cancelCard(OWNER_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("접근 권한 없으면 CARD_FORBIDDEN 발생")
        void cardForbidden_throwsException() {
            stubCardFoundAsOwner();
            stubFamilyAuthEmpty(UNAUTHORIZED_ID);

            assertThatThrownBy(() -> cardService.cancelCard(UNAUTHORIZED_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("카드 취소 성공 - isUse = false")
        void success() {
            stubCardFoundAsOwner();

            cardService.cancelCard(OWNER_ID, CARD_ID);

            assertThat(activeCard.getIsUse()).isFalse();
        }
    }

    // ── getCashAccounts ───────────────────────────────────────────────────────

    @Nested
    @DisplayName("getCashAccounts")
    class GetCashAccounts {

        @Test
        @DisplayName("CASH 계좌 목록 정상 반환")
        void success() {
            when(accountRepository.findByUser_UserIdAndAssetCateCd(OWNER_ID, AssetCategory.CASH))
                    .thenReturn(List.of(cashAccount));

            List<AccountListResponse> result = cardService.getCashAccounts(OWNER_ID);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getAccountId()).isEqualTo(String.valueOf(ACCOUNT_ID));
            assertThat(result.get(0).getInstNm()).isEqualTo("하나은행");
        }

        @Test
        @DisplayName("계좌 없으면 빈 리스트 반환")
        void emptyList() {
            when(accountRepository.findByUser_UserIdAndAssetCateCd(OWNER_ID, AssetCategory.CASH))
                    .thenReturn(Collections.emptyList());

            assertThat(cardService.getCashAccounts(OWNER_ID)).isEmpty();
        }
    }

    // ── getCardUsages ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getCardUsages")
    class GetCardUsages {

        @Test
        @DisplayName("카드 없으면 CARD_NOT_FOUND 발생")
        void cardNotFound_throwsException() {
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.getCardUsages(OWNER_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("접근 권한 없으면 CARD_FORBIDDEN 발생")
        void cardForbidden_throwsException() {
            stubCardFoundAsOwner();
            stubFamilyAuthEmpty(UNAUTHORIZED_ID);

            assertThatThrownBy(() -> cardService.getCardUsages(UNAUTHORIZED_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("사용 내역 목록 정상 반환")
        void success() {
            stubCardFoundAsOwner();
            when(cardUsageRepository.findByCard_CardIdOrderByCreatedAtDesc(CARD_ID))
                    .thenReturn(List.of(cardUsage));

            List<CardUsageResponse> result = cardService.getCardUsages(OWNER_ID, CARD_ID);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getUsageNm()).isEqualTo("편의점");
            assertThat(result.get(0).getUsageAmt()).isEqualByComparingTo(new BigDecimal("5000"));
        }
    }

    // ── getFamilyMembers ──────────────────────────────────────────────────────

    @Nested
    @DisplayName("getFamilyMembers")
    class GetFamilyMembers {

        @Test
        @DisplayName("같은 granteeId 중복 제거 후 1명만 반환")
        void deduplicatesByGranteeId() {
            TBUser familyUser = TBUser.builder().userId(FAMILY_USER_ID).userNm("자녀").build();
            TBFamilyAuth auth1 = TBFamilyAuth.builder()
                    .familyAuthId(301L).grantor(ownerUser).grantee(familyUser)
                    .relationCd(FamilyRelation.CHILD).build();
            TBFamilyAuth auth2 = TBFamilyAuth.builder()
                    .familyAuthId(302L).grantor(ownerUser).grantee(familyUser)
                    .relationCd(FamilyRelation.CHILD).build();

            when(familyAuthRepository.findAllByGrantor_UserId(OWNER_ID))
                    .thenReturn(List.of(auth1, auth2));

            List<FamilyMemberResponse> result = cardService.getFamilyMembers(OWNER_ID);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getUserNm()).isEqualTo("자녀");
        }

        @Test
        @DisplayName("가족 없으면 빈 리스트 반환")
        void emptyList() {
            when(familyAuthRepository.findAllByGrantor_UserId(OWNER_ID))
                    .thenReturn(Collections.emptyList());

            assertThat(cardService.getFamilyMembers(OWNER_ID)).isEmpty();
        }

        @Test
        @DisplayName("서로 다른 가족 2명 모두 반환")
        void multipleFamilyMembers() {
            TBUser child = TBUser.builder().userId(2L).userNm("자녀").build();
            TBUser spouse = TBUser.builder().userId(3L).userNm("배우자").build();
            TBFamilyAuth auth1 = TBFamilyAuth.builder()
                    .familyAuthId(301L).grantor(ownerUser).grantee(child)
                    .relationCd(FamilyRelation.CHILD).build();
            TBFamilyAuth auth2 = TBFamilyAuth.builder()
                    .familyAuthId(302L).grantor(ownerUser).grantee(spouse)
                    .relationCd(FamilyRelation.SPOUSE).build();

            when(familyAuthRepository.findAllByGrantor_UserId(OWNER_ID))
                    .thenReturn(List.of(auth1, auth2));

            assertThat(cardService.getFamilyMembers(OWNER_ID)).hasSize(2);
        }
    }

    // ── getMyCards ────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getMyCards")
    class GetMyCards {

        @Test
        @DisplayName("본인 카드 + 공유 카드 통합, null 카드 필터링")
        void combinedCards_nullCardFiltered() {
            TBCard sharedCard = TBCard.builder()
                    .cardId(200L).cardNm("B::공유 카드")
                    .account(cashAccount).isUse(true)
                    .balanceAmt(BigDecimal.ZERO)
                    .limitAmt(new BigDecimal("500000"))
                    .autoTransAmt(BigDecimal.ZERO).payDay(10).build();

            TBFamilyAuth grantorAuth = TBFamilyAuth.builder().card(sharedCard).build();
            TBFamilyAuth granteeAuthNullCard = TBFamilyAuth.builder().card(null).build();

            when(cardRepository.findAllByAccount_User_UserId(OWNER_ID))
                    .thenReturn(List.of(activeCard));
            when(familyAuthRepository.findAllByGrantor_UserIdAndIsCardViewTrue(OWNER_ID))
                    .thenReturn(List.of(grantorAuth));
            when(familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(OWNER_ID))
                    .thenReturn(List.of(granteeAuthNullCard));

            List<CardRegisterResponse> result = cardService.getMyCards(OWNER_ID);

            assertThat(result).hasSize(2);
        }

        @Test
        @DisplayName("카드 없으면 빈 리스트 반환")
        void noCards() {
            when(cardRepository.findAllByAccount_User_UserId(OWNER_ID))
                    .thenReturn(Collections.emptyList());
            when(familyAuthRepository.findAllByGrantor_UserIdAndIsCardViewTrue(OWNER_ID))
                    .thenReturn(Collections.emptyList());
            when(familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(OWNER_ID))
                    .thenReturn(Collections.emptyList());

            assertThat(cardService.getMyCards(OWNER_ID)).isEmpty();
        }
    }

    // ── chargeCard ────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("chargeCard")
    class ChargeCard {

        @Test
        @DisplayName("카드 없으면 CARD_NOT_FOUND 발생")
        void cardNotFound_throwsException() {
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("접근 권한 없으면 CARD_FORBIDDEN 발생")
        void cardForbidden_throwsException() {
            stubCardFoundAsOwner();
            stubFamilyAuthEmpty(UNAUTHORIZED_ID);

            assertThatThrownBy(() -> cardService.chargeCard(UNAUTHORIZED_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("비활성 카드 충전 시 CARD_DISABLED 발생")
        void cardDisabled_throwsException() {
            TBCard disabledCard = TBCard.builder()
                    .cardId(CARD_ID).cardNm("A::비활성").account(cashAccount)
                    .isUse(false).balanceAmt(BigDecimal.ZERO)
                    .limitAmt(BigDecimal.ZERO).autoTransAmt(BigDecimal.ZERO).payDay(1)
                    .build();
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.of(disabledCard));

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_DISABLED.getMessage());
        }

        @Test
        @DisplayName("충전 후 잔액 200만원 초과 시 CARD_BALANCE_EXCEEDED 발생")
        void balanceExceeded_throwsException() {
            TBCard nearLimitCard = TBCard.builder()
                    .cardId(CARD_ID).cardNm("A::잔액").account(cashAccount)
                    .isUse(true).balanceAmt(new BigDecimal("1990000"))
                    .limitAmt(new BigDecimal("2000000")).autoTransAmt(BigDecimal.ZERO).payDay(1)
                    .build();
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.of(nearLimitCard));

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("20000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_BALANCE_EXCEEDED.getMessage());
        }

        @Test
        @DisplayName("계좌 없으면 ACCOUNT_NOT_FOUND 발생")
        void accountNotFound_throwsException() {
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("타인 계좌 사용 시 ACCOUNT_FORBIDDEN 발생")
        void accountForbidden_throwsException() {
            TBAccount otherAccount = TBAccount.builder()
                    .accountId(ACCOUNT_ID)
                    .user(TBUser.builder().userId(UNAUTHORIZED_ID).build())
                    .assetCateCd(AssetCategory.CASH)
                    .balanceAmt(new BigDecimal("500000"))
                    .instNm("x").accountNm("x").accountNum("x").build();
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(otherAccount));

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("CASH 아닌 계좌 사용 시 ACCOUNT_NOT_CASH 발생")
        void accountNotCash_throwsException() {
            TBAccount stockAccount = TBAccount.builder()
                    .accountId(ACCOUNT_ID).user(ownerUser)
                    .assetCateCd(AssetCategory.STOCK)
                    .balanceAmt(new BigDecimal("500000"))
                    .instNm("x").accountNm("x").accountNum("x").build();
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(stockAccount));

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_NOT_CASH.getMessage());
        }

        @Test
        @DisplayName("계좌 잔액 부족 시 ACCOUNT_INSUFFICIENT 발생")
        void insufficientBalance_throwsException() {
            TBAccount lowAccount = TBAccount.builder()
                    .accountId(ACCOUNT_ID).user(ownerUser)
                    .assetCateCd(AssetCategory.CASH)
                    .balanceAmt(new BigDecimal("1000"))
                    .instNm("x").accountNm("x").accountNum("x").build();
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(lowAccount));

            assertThatThrownBy(() -> cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000"))))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.ACCOUNT_INSUFFICIENT.getMessage());
        }

        @Test
        @DisplayName("충전 성공 - 카드 잔액 증가, 계좌 잔액 감소, 사용 내역 저장")
        void success() {
            stubCardFoundAsOwner();
            when(accountRepository.findById(ACCOUNT_ID)).thenReturn(Optional.of(cashAccount));
            when(cardUsageRepository.save(any(TBCardUsage.class)))
                    .thenAnswer(inv -> inv.getArgument(0));

            cardService.chargeCard(OWNER_ID, chargeRequest(new BigDecimal("50000")));

            assertThat(activeCard.getBalanceAmt()).isEqualByComparingTo(new BigDecimal("50000"));
            assertThat(cashAccount.getBalanceAmt()).isEqualByComparingTo(new BigDecimal("450000"));
            verify(cardUsageRepository).save(any(TBCardUsage.class));
        }

        @Test
        @DisplayName("가족 공유 권한으로 카드 충전 성공")
        void success_familyMemberAccess() {
            TBFamilyAuth familyAuth = TBFamilyAuth.builder()
                    .familyAuthId(FAMILY_AUTH_ID)
                    .card(activeCard)
                    .isCardView(true)
                    .build();
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.of(activeCard));
            when(familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(FAMILY_USER_ID))
                    .thenReturn(List.of(familyAuth));
            when(cardUsageRepository.save(any(TBCardUsage.class)))
                    .thenAnswer(inv -> inv.getArgument(0));

            TBUser familyUser = TBUser.builder().userId(FAMILY_USER_ID).userNm("자녀").build();
            TBAccount familyAccount = TBAccount.builder()
                    .accountId(20L).user(familyUser)
                    .assetCateCd(AssetCategory.CASH)
                    .balanceAmt(new BigDecimal("500000"))
                    .instNm("x").accountNm("x").accountNum("x").build();

            CardChargeRequest req = new CardChargeRequest();
            ReflectionTestUtils.setField(req, "cardId", String.valueOf(CARD_ID));
            ReflectionTestUtils.setField(req, "accountId", String.valueOf(20L));
            ReflectionTestUtils.setField(req, "chargeAmt", new BigDecimal("30000"));

            when(accountRepository.findById(20L)).thenReturn(Optional.of(familyAccount));

            cardService.chargeCard(FAMILY_USER_ID, req);

            assertThat(activeCard.getBalanceAmt()).isEqualByComparingTo(new BigDecimal("30000"));
            verify(cardUsageRepository).save(any(TBCardUsage.class));
        }
    }

    // ── getCardBalance ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getCardBalance")
    class GetCardBalance {

        @Test
        @DisplayName("카드 없으면 CARD_NOT_FOUND 발생")
        void cardNotFound_throwsException() {
            when(cardRepository.findById(CARD_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.getCardBalance(OWNER_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("접근 권한 없으면 CARD_FORBIDDEN 발생")
        void cardForbidden_throwsException() {
            stubCardFoundAsOwner();
            stubFamilyAuthEmpty(UNAUTHORIZED_ID);

            assertThatThrownBy(() -> cardService.getCardBalance(UNAUTHORIZED_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("가족 공유 권한 있지만 다른 카드 - CARD_FORBIDDEN 발생")
        void familyAuthForDifferentCard_throwsException() {
            TBCard differentCard = TBCard.builder()
                    .cardId(999L).cardNm("A::다른").account(cashAccount)
                    .isUse(true).balanceAmt(BigDecimal.ZERO)
                    .limitAmt(BigDecimal.ZERO).autoTransAmt(BigDecimal.ZERO).payDay(1)
                    .build();
            TBFamilyAuth authOtherCard = TBFamilyAuth.builder()
                    .familyAuthId(FAMILY_AUTH_ID).card(differentCard).build();

            stubCardFoundAsOwner();
            when(familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(UNAUTHORIZED_ID))
                    .thenReturn(List.of(authOtherCard));

            assertThatThrownBy(() -> cardService.getCardBalance(UNAUTHORIZED_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("가족 공유 권한의 card가 null - CARD_FORBIDDEN 발생")
        void familyAuthNullCard_throwsException() {
            TBFamilyAuth authNullCard = TBFamilyAuth.builder()
                    .familyAuthId(FAMILY_AUTH_ID).card(null).build();

            stubCardFoundAsOwner();
            when(familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(UNAUTHORIZED_ID))
                    .thenReturn(List.of(authNullCard));

            assertThatThrownBy(() -> cardService.getCardBalance(UNAUTHORIZED_ID, CARD_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_FORBIDDEN.getMessage());
        }

        @Test
        @DisplayName("카드 잔액 정상 반환")
        void success() {
            activeCard.setBalanceAmt(new BigDecimal("123000"));
            stubCardFoundAsOwner();

            BigDecimal result = cardService.getCardBalance(OWNER_ID, CARD_ID);

            assertThat(result).isEqualByComparingTo(new BigDecimal("123000"));
        }
    }

    // ── getCardUsage ──────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getCardUsage")
    class GetCardUsage {

        @Test
        @DisplayName("사용 내역 없으면 CARD_NOT_FOUND 발생")
        void usageNotFound_throwsException() {
            when(cardUsageRepository.findById(USAGE_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cardService.getCardUsage(OWNER_ID, USAGE_ID))
                    .isInstanceOf(ApiException.class)
                    .hasMessage(ErrorStatus.CARD_NOT_FOUND.getMessage());
        }

        @Test
        @DisplayName("사용 내역 단건 정상 반환")
        void success() {
            when(cardUsageRepository.findById(USAGE_ID)).thenReturn(Optional.of(cardUsage));

            CardUsageResponse result = cardService.getCardUsage(OWNER_ID, USAGE_ID);

            assertThat(result.getUsageNm()).isEqualTo("편의점");
            assertThat(result.getUsageAmt()).isEqualByComparingTo(new BigDecimal("5000"));
            assertThat(result.getUsageTypeCd()).isEqualTo("SPEND");
        }
    }
}
