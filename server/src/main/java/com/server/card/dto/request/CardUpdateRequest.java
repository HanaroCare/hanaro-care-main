package com.server.card.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;

@Getter
public class CardUpdateRequest {

  @NotNull
  @DecimalMax("600000")
  @Schema(description = "월 한도 금액 (최대 60만원)", example = "500000")
  private BigDecimal limitAmt;

  @NotNull
  @Schema(description = "충전 계좌 ID", example = "2001")
  private Long accountId;
}
