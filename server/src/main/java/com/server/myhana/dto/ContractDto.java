package com.server.myhana.dto;

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
public class ContractDto {

  private String userName;
  private String userPhone;
  private String guardianName;
  private String guardianRelation;
  private String[] permission = new String[5];

}
