package com.server.card.service;

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
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.FamilyAuthRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardService {

  private final CardRepository cardRepository;
  private final CardUsageRepository cardUsageRepository;
  private final AccountRepository accountRepository;
  private final FamilyAuthRepository familyAuthRepository;

  @Transactional
  public TBCard registerCard(Long userId, CardRegisterRequest request) {
    if (request.getLimitAmt().compareTo(new BigDecimal("2000000")) > 0) {
      // 600000 초과
      throw new ApiException(ErrorStatus.CARD_LIMIT_EXCEEDED);
    }

    TBAccount account = accountRepository.findById(Long.parseLong(request.getAccountId()))
        .orElseThrow(() -> new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

    // 본인 계좌인지 검증
    if (!account.getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus.ACCOUNT_FORBIDDEN);
    }

    TBCard card = TBCard.builder()
        .cardNm(request.getDesignCd() + "::" + request.getCardNm())
        .limitAmt(request.getLimitAmt())
        .autoTransAmt(request.getAutoTransAmt() != null
            ? request.getAutoTransAmt()
            : BigDecimal.ZERO)
        .account(account)
        .payDay(request.getPayDay())
        .build();

    TBCard savedCard = cardRepository.save(card);

    // ✅ 본인 selfAuth 추가
    TBFamilyAuth selfAuth = TBFamilyAuth.builder()
        .grantor(account.getUser())
        .grantee(account.getUser())
        .relationCd(FamilyRelation.FAMILY)
        .isCardView(true)
        .card(savedCard)
        .build();
    familyAuthRepository.save(selfAuth);

    if (request.getFamilyAuthIds() != null && !request.getFamilyAuthIds().isEmpty()) {
      List<Long> familyAuthLongIds = request.getFamilyAuthIds().stream()
          .map(Long::parseLong)
          .toList();
      List<TBFamilyAuth> familyAuths = familyAuthRepository.findAllById(familyAuthLongIds);

      // ✅ grantor+grantee 조합으로 중복 제거
      Map<String, TBFamilyAuth> deduped = new java.util.LinkedHashMap<>();
      for (TBFamilyAuth auth : familyAuths) {
        String key = auth.getGrantor().getUserId() + "_" + auth.getGrantee().getUserId();
        deduped.putIfAbsent(key, auth);
      }

      List<TBFamilyAuth> newAuths = deduped.values().stream()
          .map(auth -> TBFamilyAuth.builder()
              .grantor(auth.getGrantor())
              .grantee(auth.getGrantee())
              .relationCd(auth.getRelationCd())
              .isCardView(true)
              .card(savedCard)
              .build())
          .toList();
      familyAuthRepository.saveAll(newAuths);
    }

    return savedCard;
  }

  @Transactional
  public TBCard updateCard(Long userId, Long cardId, CardUpdateRequest request) {
    // 카드 조회 실패
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus.CARD_NOT_FOUND));

    // 카드 권한 검증
    validateCardAccess(userId, card);

    TBAccount account = accountRepository.findById(Long.parseLong(request.getAccountId()))
        .orElseThrow(() -> new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

    // 1. 본인 계좌 검증
    if (!account.getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus.ACCOUNT_FORBIDDEN);
    }
    // 2. CASH 계좌 검증
    if (account.getAssetCateCd() != AssetCategory.CASH) {
      throw new ApiException(ErrorStatus.ACCOUNT_NOT_CASH);
    }

    if (request.getPayDay() != null) {
      card.setPayDay(request.getPayDay());
    }

    card.setAccount(account);
    card.setAutoTransAmt(request.getAutoTransAmt());

    return cardRepository.save(card);
  }

  @Transactional
  public void cancelCard(Long userId, Long cardId) {
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus.CARD_NOT_FOUND));

    // 카드 권한 검증
    validateCardAccess(userId, card);

    card.setIsUse(false);
  }

  @Transactional(readOnly = true)
  public List<AccountListResponse> getCashAccounts(Long userId) {
    return accountRepository.findByUser_UserIdAndAssetCateCd(userId, AssetCategory.CASH)
        .stream()
        .map(AccountListResponse::from)
        .toList();
  }

  public List<CardUsageResponse> getCardUsages(Long userId, Long cardId) {
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus.CARD_NOT_FOUND));

    //카드 권한 검증
    validateCardAccess(userId, card);

    return cardUsageRepository.findByCard_CardIdOrderByCreatedAtDesc(cardId)
        .stream()
        .map(CardUsageResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FamilyMemberResponse> getFamilyMembers(Long userId) {
    return familyAuthRepository.findAllByGrantor_UserId(userId)
        .stream()
        .collect(Collectors.toMap(
            auth -> auth.getGrantee().getUserId(),  // granteeId 기준 중복 제거
            auth -> auth,
            (existing, replacement) -> existing  // 중복이면 첫 번째 유지
        ))
        .values()
        .stream()
        .map(FamilyMemberResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<CardRegisterResponse> getMyCards(Long userId) {
    Map<Long, TBCard> cardMap = new java.util.LinkedHashMap<>();

    // 1. 본인이 발급한 카드 (account 기준)
    cardRepository.findAllByAccount_User_UserId(userId)
        .forEach(c -> cardMap.put(c.getCardId(), c));

    // 2. FamilyAuth 기반 카드
    familyAuthRepository.findAllByGrantor_UserIdAndIsCardViewTrue(userId)
        .stream().map(TBFamilyAuth::getCard).filter(c -> c != null)
        .forEach(c -> cardMap.put(c.getCardId(), c));
    familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(userId)
        .stream().map(TBFamilyAuth::getCard).filter(c -> c != null)
        .forEach(c -> cardMap.put(c.getCardId(), c));

    return cardMap.values().stream()
        .map(CardRegisterResponse::from)
        .toList();
  }

  @Transactional
  public void chargeCard(Long userId, CardChargeRequest request) {
    TBCard card = cardRepository.findById(Long.parseLong(request.getCardId()))
        .orElseThrow(() -> new ApiException(ErrorStatus.CARD_NOT_FOUND));

    // 카드 권한 검증
    validateCardAccess(userId, card);

    // 카드 사용 가능 여부
    if (!card.getIsUse()) {
      throw new ApiException(ErrorStatus.CARD_DISABLED);
    }

    // 총 잔액 200만원 초과 검증
    BigDecimal newBalance = card.getBalanceAmt().add(request.getChargeAmt());
    if (newBalance.compareTo(new BigDecimal("2000000")) > 0) {
      throw new ApiException(ErrorStatus.CARD_BALANCE_EXCEEDED);
    }

    TBAccount account = accountRepository.findById(Long.parseLong(request.getAccountId()))
        .orElseThrow(() -> new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

    // 1. 본인 계좌 검증
    if (!account.getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus.ACCOUNT_FORBIDDEN);
    }
    // 2. CASH 계좌 검증
    if (account.getAssetCateCd() != AssetCategory.CASH) {
      throw new ApiException(ErrorStatus.ACCOUNT_NOT_CASH);
    }

    // 계좌 잔액 차감
    if (account.getBalanceAmt().compareTo(request.getChargeAmt()) < 0) {
      // 계좌 잔액 부족
      throw new ApiException(ErrorStatus.ACCOUNT_INSUFFICIENT);
    }
    account.setBalanceAmt(account.getBalanceAmt().subtract(request.getChargeAmt()));

    // 현금 계좌인지 검증
    if (account.getAssetCateCd() != AssetCategory.CASH) {
      throw new ApiException(ErrorStatus.ACCOUNT_NOT_CASH);
    }

    // 잔액 업데이트
    card.setBalanceAmt(newBalance);

    // 충전 내역 저장
    TBCardUsage usage = TBCardUsage.builder()
        .card(card)
        .usageNm("충전")
        .usageTypeCd(TBCardUsage.UsageType.CHARGE)
        .usageAmt(request.getChargeAmt())
        .abnmlYn("N")
        .aprvlYn("Y")
        .build();

    cardUsageRepository.save(usage);
  }

  @Transactional(readOnly = true)
  public BigDecimal getCardBalance(Long userId, Long cardId) {
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus.CARD_NOT_FOUND));

    // 카드 권한 검증
    validateCardAccess(userId, card);

    return card.getBalanceAmt();
  }

  private void validateCardAccess(Long userId, TBCard card) {
    // 카드 발급자인지 확인
    if (card.getAccount().getUser().getUserId().equals(userId)) {
      return;
    }
    // 가족 공유 권한 확인
    boolean hasAccess = familyAuthRepository
        .findAllByGrantee_UserIdAndIsCardViewTrue(userId)
        .stream()
        .anyMatch(auth -> auth.getCard() != null &&
            auth.getCard().getCardId().equals(card.getCardId()));

    if (!hasAccess) {
      throw new ApiException(ErrorStatus.CARD_FORBIDDEN);
    }
  }

  @Transactional(readOnly = true)
  public CardUsageResponse getCardUsage(Long userId, Long usageId) {
    TBCardUsage usage = cardUsageRepository.findById(usageId)
        .orElseThrow(() -> new ApiException(ErrorStatus.CARD_NOT_FOUND));
    return CardUsageResponse.from(usage);
  }
}
