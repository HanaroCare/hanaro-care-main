package com.server.asset.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.server.asset.entity.enums.AssetCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "금융 자산 상세 정보 응답")
public record FinancialAssetResponse(
    @Schema(description = "계좌 ID", example = "2001")
    Long accountId,
    
    @Schema(description = "자산 카테고리 코드", example = "CASH")
    AssetCategory assetCateCd,
    
    @Schema(description = "기관명", example = "하나은행")
    String instNm,
    
    @Schema(description = "계좌명", example = "하나 자유입출금")
    String accountNm,
    
    @Schema(description = "계좌번호", example = "111-222-333333")
    String accountNum,
    
    @Schema(description = "잔액", example = "50000000.00")
    BigDecimal balanceAmt,
    
    @Schema(description = "수익률 (%)", example = "3.5")
    BigDecimal profitRate,
    
    @Schema(description = "생성일시")
    LocalDateTime createdAt,
    
    @Schema(description = "수정일시")
    LocalDateTime updatedAt
) {}
