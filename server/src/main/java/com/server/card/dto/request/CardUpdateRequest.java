package com.server.card.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;

@Getter
public class CardUpdateRequest {

  @NotNull
  @DecimalMax("2000000")
  @Schema(description = "자동이체 목표 잔액 (최대 200만원)", example = "500000")
  private BigDecimal autoTransAmt;

  @NotNull
  @Schema(description = "충전 계좌 ID", example = "2001")
  private Long accountId;

  @Min(1)
  @Max(28)
  @Schema(description = "자동이체일 (1~28일)", example = "15")
  private Integer payDay;
}
