package com.server.card.service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.TBAccountRepository;
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
import com.server.user.repository.FamilyAuthRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardService {

  private final CardRepository cardRepository;
  private final CardUsageRepository cardUsageRepository;
  private final TBAccountRepository accountRepository;
  private final FamilyAuthRepository familyAuthRepository;

  @Transactional
  public TBCard registerCard(Long userId, CardRegisterRequest request) {
    if (request.getLimitAmt().compareTo(new BigDecimal("600000")) > 0) {
      throw new ApiException(ErrorStatus._BAD_REQUEST);
    }

    TBAccount account = accountRepository.findById(request.getAccountId())
        .orElseThrow(() -> new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

    // 본인 계좌인지 검증
    if (!account.getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

    TBCard card = TBCard.builder()
        .cardNm(request.getDesignCd() + "::" + request.getCardNm())
        .limitAmt(request.getLimitAmt())
        .autoTransAmt(request.getAutoTransAmt() != null
            ? request.getAutoTransAmt()
            : BigDecimal.ZERO)
        .account(account)
        .build();

    TBCard savedCard = cardRepository.save(card);

    if (request.getFamilyAuthIds() != null && !request.getFamilyAuthIds().isEmpty()) {
      List<com.server.user.entity.TBFamilyAuth> familyAuths = familyAuthRepository.findAllById(
          request.getFamilyAuthIds());
      for (com.server.user.entity.TBFamilyAuth auth : familyAuths) {
        auth.setIsCardView(true);
        auth.setCard(savedCard);
      }
      familyAuthRepository.saveAll(familyAuths);
    }

    return savedCard;
  }

  @Transactional
  public TBCard updateCard(Long userId, Long cardId, CardUpdateRequest request) {
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    // 카드 권한 검증
    validateCardAccess(userId, card);

    TBAccount account = accountRepository.findById(request.getAccountId())
        .orElseThrow(() -> new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

    card.setLimitAmt(request.getLimitAmt());
    card.setAccount(account);

    return cardRepository.save(card);
  }

  @Transactional
  public void cancelCard(Long userId, Long cardId) {
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

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
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

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
        .map(FamilyMemberResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<CardRegisterResponse> getMyCards(Long userId) {
    List<TBFamilyAuth> grantorCards = familyAuthRepository.findAllByGrantor_UserIdAndIsCardViewTrue(
        userId);
    List<TBFamilyAuth> granteeCards = familyAuthRepository.findAllByGrantee_UserIdAndIsCardViewTrue(
        userId);

    List<TBCard> cards = new java.util.ArrayList<>();
    grantorCards.stream().map(TBFamilyAuth::getCard).filter(c -> c != null).forEach(cards::add);
    granteeCards.stream().map(TBFamilyAuth::getCard).filter(c -> c != null).forEach(cards::add);

    return cards.stream()
        .map(CardRegisterResponse::from)
        .toList();
  }

  @Transactional
  public void chargeCard(Long userId, CardChargeRequest request) {
    TBCard card = cardRepository.findById(request.getCardId())
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    // 카드 권한 검증
    validateCardAccess(userId, card);

    // 카드 사용 가능 여부
    if (!card.getIsUse()) {
      throw new ApiException(ErrorStatus._BAD_REQUEST);
    }

    // 총 잔액 200만원 초과 검증
    BigDecimal newBalance = card.getBalanceAmt().add(request.getChargeAmt());
    if (newBalance.compareTo(new BigDecimal("2000000")) > 0) {
      throw new ApiException(ErrorStatus._BAD_REQUEST);
    }

    TBAccount account = accountRepository.findById(request.getAccountId())
        .orElseThrow(() -> new ApiException(ErrorStatus.ACCOUNT_NOT_FOUND));

    // 본인 계좌인지 검증
    if (!account.getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

    // 계좌 잔액 차감
    if (account.getBalanceAmt().compareTo(request.getChargeAmt()) < 0) {
      throw new ApiException(ErrorStatus._BAD_REQUEST);
    }
    account.setBalanceAmt(account.getBalanceAmt().subtract(request.getChargeAmt()));

    // 현금 계좌인지 검증
    if (account.getAssetCateCd() != AssetCategory.CASH) {
      throw new ApiException(ErrorStatus._BAD_REQUEST);
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
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

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
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }
  }
}
