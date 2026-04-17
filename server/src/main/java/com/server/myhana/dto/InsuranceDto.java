package com.server.myhana.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsuranceDto {

  private Long accountId;
  private String instNm;
  private String accountNm;
  private BigDecimal monthlyPremAmt;
  private String username;

}
