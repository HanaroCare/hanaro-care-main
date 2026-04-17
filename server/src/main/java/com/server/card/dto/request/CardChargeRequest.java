package com.server.card.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;

@Getter
public class CardChargeRequest {

  @NotNull
  @Schema(description = "카드 ID", example = "4001")
  private String cardId;

  @NotNull
  @DecimalMin("1000")
  @DecimalMax("600000")
  @Schema(description = "충전 금액 (1천원 이상 60만원 이하)", example = "70000")
  private BigDecimal chargeAmt;

  @NotNull
  @Schema(description = "충전할 계좌 ID", example = "2001")
  private Long accountId;
}
