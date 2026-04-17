package com.server.asset.dto.link;

import java.math.BigDecimal;

import com.server.asset.entity.enums.AssetCategory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "마이데이터 연동 가능 계좌 응답")
public record AccountLinkResponse(

    @Schema(description = "계좌 ID", example = "691274982960660480")
    String accountId,

    @Schema(description = "기관명", example = "하나은행")
    String instNm,

    @Schema(description = "계좌명", example = "하나 청년적금")
    String accountNm,

    @Schema(description = "계좌번호", example = "111-222-034521")
    String accountNum,

    @Schema(description = "잔액", example = "3000000.00")
    BigDecimal balanceAmt,

    @Schema(description = "자산 카테고리", example = "CASH")
    AssetCategory assetCateCd,

    @Schema(description = "마이데이터 연동 여부", example = "true")
    Boolean isLinked
) {}
