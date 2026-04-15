package com.server.card.dto.response;

import com.server.card.entity.TBCard;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CardUpdateResponse {

  @Schema(description = "카드 ID", example = "832134590413334525")
  private String cardId;

  @Schema(description = "카드 이름", example = "김복순 요양사의 카드")
  private String cardNm;

  @Schema(description = "월 한도", example = "500000")
  private BigDecimal limitAmt;

  @Schema(description = "충전 계좌 ID", example = "2001")
  private Long accountId;

  public static CardUpdateResponse from(TBCard card) {
    return CardUpdateResponse.builder()
        .cardId(String.valueOf(card.getCardId()))
        .cardNm(card.getCardNm())
        .limitAmt(card.getLimitAmt())
        .accountId(card.getAccount().getAccountId())
        .build();
  }
}
