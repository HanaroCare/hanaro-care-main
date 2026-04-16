package com.server.myhana.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InsuranceListResponse {

  private List<InsuranceDto> insurances;
  private Boolean isInsAgent;
}
