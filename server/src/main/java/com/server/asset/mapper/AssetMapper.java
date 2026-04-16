package com.server.asset.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.server.asset.dto.dashboard.AssetDashboardResponse.FinancialAssetSummary;
import com.server.asset.dto.dashboard.AssetDashboardResponse.RealAssetSummary;
import com.server.asset.dto.dashboard.AssetDetailResponse;
import com.server.asset.dto.dashboard.FinancialAssetResponse;
import com.server.asset.dto.link.AccountLinkResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.AssetCategory;

@Mapper(componentModel = "spring")
public interface AssetMapper {

    // 1. 금융 자산 목록 조회용
    FinancialAssetResponse toFinancialAssetResponse(TBAccount account);
    List<FinancialAssetResponse> toFinancialAssetResponseList(List<TBAccount> accounts);

    // 1-1. 마이데이터 연동 계좌 목록 조회용 (isLinked 포함)
    // accountId: JS 18자리 이상 Long 정밀도 손실 방지를 위해 String으로 직렬화
    @Mapping(target = "accountId", expression = "java(String.valueOf(account.getAccountId()))")
    AccountLinkResponse toAccountLinkResponse(TBAccount account);
    List<AccountLinkResponse> toAccountLinkResponseList(List<TBAccount> accounts);

    // 2. 실물 자산(부동산, 자동차, 금) 단건 상세 조회
    // 리스트 변환용으로 썼던 명칭을 그대로 사용하거나, 명확하게 단건용으로 정의합니다.
    @Mapping(target = "assetId", source = "realAssetId")
    @Mapping(target = "amount", source = "evalAmt")
    @Mapping(target = "instNm", ignore = true)        // 실물자산엔 기관명 없음
    @Mapping(target = "monthlyPremAmt", ignore = true) // 실물자산엔 월납입금 없음
    @Mapping(target = "expireDt", ignore = true)       // 실물자산엔 만기일 없음
    AssetDetailResponse toAssetDetailFromRealEntity(TBRealAsset asset);

    // 3. 금융 계좌 및 보험 단건 상세 조회
    @Mapping(target = "assetId", source = "accountId")
    @Mapping(target = "assetNm", source = "accountNm")
    @Mapping(target = "amount", source = "balanceAmt")
    @Mapping(target = "addr", ignore = true)           // 계좌엔 주소 없음
    @Mapping(target = "assetSize", ignore = true)      // 계좌엔 면적 없음
    @Mapping(target = "assetDesc", ignore = true)      // 계좌엔 상세설명 없음
    AssetDetailResponse toAssetDetailFromAccountEntity(TBAccount account);

    // --- 아래는 기존 대시보드 및 리스트 기능을 위해 유지 ---

    List<AssetDetailResponse> toAssetDetailListFromReal(List<TBRealAsset> assets);
    List<AssetDetailResponse> toAssetDetailListFromAccount(List<TBAccount> accounts);

    default FinancialAssetSummary toFinancialAssetSummary(Object[] row) {
        if (row == null || row.length < 2) return null;
        return FinancialAssetSummary.builder()
            .assetCateCd((AssetCategory) row[0])
            .totalBalance((BigDecimal) row[1])
            .build();
    }

    @Mapping(target = "realAssetId", source = "realAssetId")
    @Mapping(target = "evalAmt", source = "evalAmt")
    RealAssetSummary toRealAssetSummary(TBRealAsset asset);

    List<RealAssetSummary> toRealAssetSummaryListFromEntity(List<TBRealAsset> assets);
    List<FinancialAssetSummary> toFinancialAssetSummaryList(List<Object[]> rows);
}
