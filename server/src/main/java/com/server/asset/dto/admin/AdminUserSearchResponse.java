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
public class AdminUserSearchResponse {

	private Long userId;
	private String userName;
	private String loginId;
	private String phoneNumber;
	private String userRole;

	public static AdminUserSearchResponse from(TBUser user) {
		return AdminUserSearchResponse.builder()
			.userId(user.getUserId())
			.userName(user.getUserNm())
			.loginId(user.getLoginId())
			.phoneNumber(user.getUserPhone())
			.userRole(user.getUserRole().name())
			.build();
	}
}
