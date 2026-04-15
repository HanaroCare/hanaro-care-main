package com.server.card.controller;

import com.server.card.dto.request.CardRegisterRequest;
import com.server.card.dto.response.CardRegisterResponse;
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
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
}
