package com.server.asset.dto.link;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.Builder;

@Builder
@Schema(description = "실물 자산 연동 결과 응답")
public record RealAssetLinkResponse(

    @Schema(description = "생성된 실물 자산 ID")
    Long realAssetId,

    @Schema(description = "자산명", example = "반포 래미안 아파트")
    String assetNm,

    @Schema(description = "평가액 (원)", example = "2950000000")
    BigDecimal evalAmt,

    @Schema(description = "차량 브랜드 — 차량 응답 전용, 그 외 null", nullable = true)
    String brand,

    @Schema(description = "차량 모델명 — 차량 응답 전용, 그 외 null", nullable = true)
    String model,

    @Schema(description = "최초 등록일 — 차량 응답 전용, 그 외 null (yyyy.MM.dd)", nullable = true)
    String registrationDt
) {}
