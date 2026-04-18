package com.server.myhana.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GrantInsuranceViewRequest {
    @Schema(description = "권한을 줄 가족 구성원의 사용자 ID", example = "1002")
    private String granteeId;
    @Schema(description = "보험 내역 공유 여부", example = "true")
    private Boolean isInsView;
}
