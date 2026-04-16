package com.server.myhana.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberResponse {
  private Long userId;
  private String name;
  private String relation; // "부모", "자녀", "배우자" etc.
  private String phone;
  private boolean isSharing;
}
