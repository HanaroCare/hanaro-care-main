package com.server.myhana.dto;

import java.time.LocalDate;
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
public class InsuranceDetailDto {

  private InsuranceDto insuranceDto;
  private LocalDate contrDt;
  private LocalDate expireDt;
}
