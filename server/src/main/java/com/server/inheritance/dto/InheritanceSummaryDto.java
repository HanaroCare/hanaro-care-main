package com.server.inheritance.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InheritanceSummaryDto {

  private String inheritDetailId;
  private String userId;
  private String username;
  private BigDecimal percent;
  private Long amt;

}
