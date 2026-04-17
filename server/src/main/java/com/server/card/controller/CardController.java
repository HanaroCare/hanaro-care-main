package com.server.card.controller;

import com.server.card.dto.request.CardChargeRequest;
import com.server.card.dto.request.CardRegisterRequest;
import com.server.card.dto.request.CardUpdateRequest;
import com.server.card.dto.response.AccountListResponse;
import com.server.card.dto.response.CardRegisterResponse;
import com.server.card.dto.response.CardUpdateResponse;
import com.server.card.dto.response.CardUsageResponse;
import com.server.card.dto.response.FamilyMemberResponse;
import com.server.card.entity.TBCard;
import com.server.card.service.CardService;
import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "돌봄 지갑 API", description = "돌봄 카드 관련 API입니다")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cards")
public class CardController {

  private final CardService cardService;

  @Operation(
      summary = "카드 발급",
      description = "요양보호사에게 지급할 돌봄 카드를 발급합니다. 월 한도는 최대 60만원입니다."
  )
  @ApiResponses({
      @io.swagger.v3.oas.annotations.responses.ApiResponse(
          responseCode = "200",
          description = "카드 발급 성공",
          content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": true,
                "code": "COMMON200",
                "message": "성공입니다.",
                "result": {
                  "cardId": 4003,
                  "cardNm": "김복순 요양사의 카드",
                  "limitAmt": 400000,
                  "autoTransAmt": 400000,
                  "isUse": true
                }
              }
              """))
      ),
      @io.swagger.v3.oas.annotations.responses.ApiResponse(
          responseCode = "400",
          description = "한도 초과 또는 잘못된 요청",
          content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": false,
                "code": "COMMON400",
                "message": "잘못된 요청입니다.",
                "result": null
              }
              """))
      ),
      @io.swagger.v3.oas.annotations.responses.ApiResponse(
          responseCode = "404",
          description = "계좌 정보 없음",
          content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": false,
                "code": "ACCOUNT_404",
                "message": "계좌 정보를 찾을 수 없습니다.",
                "result": null
              }
              """))
      )
  })
  @PostMapping
  public ApiResponse<CardRegisterResponse> registerCard(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @Valid @RequestBody CardRegisterRequest request) {
    TBCard card = cardService.registerCard(subscriberDTO.getUserId(), request);
    return ApiResponse.onSuccess(CardRegisterResponse.from(card));
  }

  @Operation(
      summary = "카드 설정 변경",
      description = "충전 계좌, 자동이체일, 자동이체 목표 잔액 변경합니다. (최대 200만원, 잔액 부족분만 자동 충전) "
  )
  @PatchMapping("/{cardId}/settings")
  public ApiResponse<CardUpdateResponse> updateCard(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable Long cardId,
      @Valid @RequestBody CardUpdateRequest request) {
    TBCard card = cardService.updateCard(subscriberDTO.getUserId(), cardId, request);
    return ApiResponse.onSuccess(CardUpdateResponse.from(card));
  }

  @Operation(
      summary = "카드 해지",
      description = "카드를 해지합니다. 해지된 카드는 사용 불가 상태로 변경됩니다."
  )
  @PatchMapping("/{cardId}/cancel")
  public ApiResponse<Void> cancelCard(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable Long cardId) {
    cardService.cancelCard(subscriberDTO.getUserId(), cardId);
    return ApiResponse.onSuccess(null);
  }

  @Operation(
      summary = "충전 계좌 목록 조회",
      description = "카드 발급/설정 변경 시 사용할 본인의 CASH 계좌 목록을 조회합니다."
  )
  @GetMapping("/accounts")
  public ApiResponse<List<AccountListResponse>> getCashAccounts(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO) {
    return ApiResponse.onSuccess(cardService.getCashAccounts(subscriberDTO.getUserId()));
  }

  @Operation(
      summary = "카드 사용 내역 조회",
      description = "특정 카드의 사용 내역을 최신순으로 조회합니다."
  )
  @GetMapping("/{cardId}/usages")
  public ApiResponse<List<CardUsageResponse>> getCardUsages(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable Long cardId) {
    return ApiResponse.onSuccess(cardService.getCardUsages(subscriberDTO.getUserId(), cardId));
  }

  @Operation(
      summary = "가족 목록 조회",
      description = "카드 발급 시 공유할 가족 목록을 조회합니다."
  )
  @GetMapping("/family")
  public ApiResponse<List<FamilyMemberResponse>> getFamilyMembers(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO) {
    return ApiResponse.onSuccess(cardService.getFamilyMembers(subscriberDTO.getUserId()));
  }

  @Operation(
      summary = "내 카드 목록 조회",
      description = "내가 발급했거나 공유받은 카드 목록을 조회합니다."
  )
  @GetMapping
  public ApiResponse<List<CardRegisterResponse>> getMyCards(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO) {
    return ApiResponse.onSuccess(cardService.getMyCards(subscriberDTO.getUserId()));
  }

  @Operation(
      summary = "카드 충전",
      description = "선택한 계좌에서 카드로 충전합니다. 1회 최대 60만원, 카드 총 잔액 200만원 이하."
  )
  @PostMapping("/charge")
  public ApiResponse<Void> chargeCard(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @Valid @RequestBody CardChargeRequest request) {
    cardService.chargeCard(subscriberDTO.getUserId(), request);
    return ApiResponse.onSuccess(null);
  }

  @Operation(
      summary = "카드 잔액 조회",
      description = "특정 카드의 현재 잔액을 조회합니다."
  )
  @GetMapping("/{cardId}/balance")
  public ApiResponse<BigDecimal> getCardBalance(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable Long cardId) {
    return ApiResponse.onSuccess(cardService.getCardBalance(subscriberDTO.getUserId(), cardId));
  }

  @GetMapping("/usages/{usageId}")
  public ApiResponse<CardUsageResponse> getCardUsage(
      @AuthenticationPrincipal SubscriberDTO subscriberDTO,
      @PathVariable Long usageId) {
    return ApiResponse.onSuccess(cardService.getCardUsage(subscriberDTO.getUserId(), usageId));
  }
}
