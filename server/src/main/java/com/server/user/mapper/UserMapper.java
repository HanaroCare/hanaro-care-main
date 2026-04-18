package com.server.user.mapper;

import com.server.user.dto.UserDetailResponseDTO;
import com.server.user.dto.UserSummaryResponseDTO;
import com.server.user.entity.TBUser;

public class UserMapper {

  private UserMapper() {
  }

  public static UserSummaryResponseDTO toSummaryResponse(TBUser user) {
    return UserSummaryResponseDTO.builder()
        .userId(String.valueOf(user.getUserId()))
        .loginId(user.getLoginId())
        .userNm(user.getUserNm())
        .userPhone(maskPhone(user.getUserPhone()))
        .isHanaCert(user.getIsHanaCert())
        .build();
  }

  public static UserDetailResponseDTO toDetailResponse(TBUser user) {
    return UserDetailResponseDTO.builder()
        .userId(String.valueOf(user.getUserId()))
        .loginId(user.getLoginId())
        .userNm(user.getUserNm())
        .userAge(user.getUserAge())
        .userPhone(user.getUserPhone())
        .isHanaCert(user.getIsHanaCert())
        .userRole(user.getUserRole().name())
        .userStatusCd(user.getUserStatusCd().name())
        .lastLoginAt(user.getLastLoginAt())
        .build();
  }

  /**
   * 전화번호 가운데 4자리 마스킹 예) 01012345678 → 010****5678
   */
  private static String maskPhone(String phone) {
    if (phone == null || phone.length() < 8) {
      return phone;
    }
    int len = phone.length();
    return phone.substring(0, len - 8) + "****" + phone.substring(len - 4);
  }
}
