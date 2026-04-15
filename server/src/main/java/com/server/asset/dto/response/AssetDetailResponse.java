package com.server.asset.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "자산 상세 정보 공통 응답 (부동산/자동차/금/보험)")
public record AssetDetailResponse(
    @Schema(description = "자산 ID", example = "1")
    Long assetId,
    
    @Schema(description = "자산 카테고리 코드", example = "REAL_ESTATE / VEHICLE / GOLD / INSURANCE")
    String assetCateCd,
    
    @Schema(description = "자산명", example = "래미안 아파트 / 그랜저 / 삼성화재 건강보험")
    String assetNm,
    
    @Schema(description = "금액 (잔액 또는 평가액)", example = "500000000.00")
    BigDecimal amount,
    
    @Schema(description = "기관명 (보험/금융기관)", example = "하나은행 / 하나생명")
    String instNm,
    
    @Schema(description = "주소 (부동산 전용)", example = "서울시 강남구 ...")
    String addr,
    
    @Schema(description = "규모/수량 (면적 또는 중량)", example = "84.5")
    BigDecimal assetSize,
    
    @Schema(description = "월 납입금 (보험 전용)", example = "150000.00")
    BigDecimal monthlyPremAmt,
    
    @Schema(description = "만기일 (보험 전용)", example = "2030-12-31")
    LocalDate expireDt,
    
    @Schema(description = "자산 설명", example = "20층 1호 / 2021년식 / KRX 금시장")
    String assetDesc,
    
    @Schema(description = "생성일시")
    LocalDateTime createdAt,
    
    @Schema(description = "수정일시")
    LocalDateTime updatedAt
) {}
