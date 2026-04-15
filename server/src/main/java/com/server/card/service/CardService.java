package com.server.card.service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.AccountRepository;
import com.server.card.dto.request.CardRegisterRequest;
import com.server.card.dto.request.CardUpdateRequest;
import com.server.card.dto.response.AccountListResponse;
import com.server.card.entity.TBCard;
import com.server.card.repository.CardRepository;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardService {

  private final CardRepository cardRepository;
  private final AccountRepository accountRepository;

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

    return cardRepository.save(card);
  }

  @Transactional
  public TBCard updateCard(Long userId, Long cardId, CardUpdateRequest request) {
    TBCard card = cardRepository.findById(cardId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    if (!card.getAccount().getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

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

    if (!card.getAccount().getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

    card.setIsUse(false);
  }

  @Transactional(readOnly = true)
  public List<AccountListResponse> getCashAccounts(Long userId) {
    return accountRepository.findByUser_UserIdAndAssetCateCd(userId, AssetCategory.CASH)
        .stream()
        .map(AccountListResponse::from)
        .toList();
  }
}
