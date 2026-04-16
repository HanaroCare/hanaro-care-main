package com.server.myhana.dto;

import java.util.List;
import lombok.Data;

@Data
public class InsuranceShareRequest {
  private Long granteeId;
  private List<Long> insuranceIds;
}
