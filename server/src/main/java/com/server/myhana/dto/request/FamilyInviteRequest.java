package com.server.myhana.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "가족 초대 요청 (추후 확장 가능성을 위해 비워둠)")
public class FamilyInviteRequest {
}
