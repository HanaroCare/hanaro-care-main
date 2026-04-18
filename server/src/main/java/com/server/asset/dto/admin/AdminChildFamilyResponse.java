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
public class AdminChildFamilyResponse {

	private String userId;
	private String userName;
	private String phoneNumber;

	public static AdminChildFamilyResponse from(TBUser user) {
		return AdminChildFamilyResponse.builder()
			.userId(String.valueOf(user.getUserId()))
			.userName(user.getUserNm())
			.phoneNumber(user.getUserPhone())
			.build();
	}
}
