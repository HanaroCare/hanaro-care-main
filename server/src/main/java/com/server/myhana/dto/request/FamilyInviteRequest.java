package com.server.myhana.dto.request;

import com.server.user.enums.FamilyRelation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FamilyInviteRequest {
    @Schema(description = "초대할 가족의 휴대폰 번호", example = "01012345678")
    private String phone;
    @Schema(description = "가족 관계", example = "CHILD")
    private FamilyRelation relation;
}
