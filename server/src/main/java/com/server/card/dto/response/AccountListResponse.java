package com.server.card.dto.response;

import com.server.asset.entity.TBAccount;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccountListResponse {

  @Schema(description = "계좌 ID", example = "2001")
  private String accountId;

  @Schema(description = "금융 기관명", example = "하나은행")
  private String instNm;

  @Schema(description = "계좌 번호", example = "123-123456-12345")
  private String accountNum;

  @Schema(description = "잔액", example = "1454927")
  private BigDecimal balanceAmt;

  public static AccountListResponse from(TBAccount account) {
    return AccountListResponse.builder()
        .accountId(String.valueOf(account.getAccountId()))
        .instNm(account.getInstNm())
        .accountNum(account.getAccountNum())
        .balanceAmt(account.getBalanceAmt())
        .build();
  }
}
