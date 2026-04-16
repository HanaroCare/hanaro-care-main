package com.server.myhana.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceResponse {
  private Long accountId;
  private String instNm;
  private String accountNm;
  private String accountNum;
}
