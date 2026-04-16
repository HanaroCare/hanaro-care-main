package com.server.card.dto.response;

import com.server.card.entity.TBCardUsage;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CardUsageResponse {

  @Schema(description = "사용 내역 ID")
  private String cardUsageId;

  @Schema(description = "가맹점명 / 입금자")
  private String usageNm;

  @Schema(description = "결제 위치")
  private String usageLoc;

  @Schema(description = "타입 (SPEND/CHARGE)")
  private String usageTypeCd;

  @Schema(description = "금액")
  private BigDecimal usageAmt;

  @Schema(description = "이상 탐지 여부")
  private String abnmlYn;

  @Schema(description = "승인 여부")
  private String aprvlYn;

  @Schema(description = "결제 일시")
  private LocalDateTime createdAt;

  public static CardUsageResponse from(TBCardUsage usage) {
    return CardUsageResponse.builder()
        .cardUsageId(String.valueOf(usage.getCardUsageId()))
        .usageNm(usage.getUsageNm())
        .usageLoc(usage.getUsageLoc())
        .usageTypeCd(usage.getUsageTypeCd().name())
        .usageAmt(usage.getUsageAmt())
        .abnmlYn(usage.getAbnmlYn())
        .aprvlYn(usage.getAprvlYn())
        .createdAt(usage.getCreatedAt())
        .build();
  }
}
