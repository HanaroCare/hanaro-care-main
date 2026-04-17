package com.server.card.dto.response;

import com.server.card.entity.TBCard;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CardRegisterResponse {

  @Schema(description = "카드 ID", example = "832134590413334525")
  private String cardId;

  @Schema(description = "카드 이름", example = "김복순 요양사의 카드")
  private String cardNm;

  @Schema(description = "월 한도", example = "400000")
  private BigDecimal limitAmt;

  @Schema(description = "자동이체 금액", example = "400000")
  private BigDecimal autoTransAmt;

  @Schema(description = "카드 사용 여부", example = "true")
  private Boolean isUse;

  @Schema(description = "카드 디자인 코드 (A~E)", example = "A")
  private String designCd;

  @Schema(description = "자동이체일")
  private Integer payDay;

  public static CardRegisterResponse from(TBCard card) {
    String rawNm = card.getCardNm(); // "A::김복순 요양사의 카드"
    String designCd = rawNm.split("::")[0];   // "A"
    String cardNm = rawNm.split("::")[1];     // "김복순 요양사의 카드"

    return CardRegisterResponse.builder()
        .cardId(String.valueOf(card.getCardId()))
        .cardNm(cardNm)
        .designCd(designCd)
        .limitAmt(card.getLimitAmt())
        .autoTransAmt(card.getAutoTransAmt())
        .isUse(card.getIsUse())
        .payDay(card.getPayDay())
        .build();
  }
}
