package com.server.asset.dto.admin;

import com.server.user.entity.TBUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetailResponse {

	private String userId;
	private String userName;
	private String loginId;
	private String phoneNumber;
	private String userRole;
	private Integer userAge;
	private String userAddr;

	public static AdminUserDetailResponse from(TBUser user) {
		return AdminUserDetailResponse.builder()
			.userId(String.valueOf(user.getUserId()))
			.userName(user.getUserNm())
			.loginId(user.getLoginId())
			.phoneNumber(user.getUserPhone())
			.userRole(user.getUserRole().name())
			.userAge(user.getUserAge())
			.userAddr(user.getUserAddr())
			.build();
	}
}
