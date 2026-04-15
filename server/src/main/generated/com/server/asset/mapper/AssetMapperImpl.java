package com.server.asset.mapper;

import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.dto.response.AssetDetailResponse;
import com.server.asset.dto.response.FinancialAssetResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBRealAsset;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-15T10:38:51+0900",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Amazon.com Inc.)"
)
@Component
public class AssetMapperImpl implements AssetMapper {

    @Override
    public FinancialAssetResponse toFinancialAssetResponse(TBAccount account) {
        if ( account == null ) {
            return null;
        }

        FinancialAssetResponse.FinancialAssetResponseBuilder financialAssetResponse = FinancialAssetResponse.builder();

        financialAssetResponse.accountId( account.getAccountId() );
        financialAssetResponse.assetCateCd( account.getAssetCateCd() );
        financialAssetResponse.instNm( account.getInstNm() );
        financialAssetResponse.accountNm( account.getAccountNm() );
        financialAssetResponse.accountNum( account.getAccountNum() );
        financialAssetResponse.balanceAmt( account.getBalanceAmt() );
        financialAssetResponse.profitRate( account.getProfitRate() );
        financialAssetResponse.createdAt( account.getCreatedAt() );
        financialAssetResponse.updatedAt( account.getUpdatedAt() );

        return financialAssetResponse.build();
    }

    @Override
    public List<FinancialAssetResponse> toFinancialAssetResponseList(List<TBAccount> accounts) {
        if ( accounts == null ) {
            return null;
        }

        List<FinancialAssetResponse> list = new ArrayList<FinancialAssetResponse>( accounts.size() );
        for ( TBAccount tBAccount : accounts ) {
            list.add( toFinancialAssetResponse( tBAccount ) );
        }

        return list;
    }

    @Override
    public AssetDetailResponse toAssetDetailResponse(TBRealAsset asset) {
        if ( asset == null ) {
            return null;
        }

        AssetDetailResponse.AssetDetailResponseBuilder assetDetailResponse = AssetDetailResponse.builder();

        assetDetailResponse.assetId( asset.getRealAssetId() );
        assetDetailResponse.amount( asset.getEvalAmt() );
        if ( asset.getAssetCateCd() != null ) {
            assetDetailResponse.assetCateCd( asset.getAssetCateCd().name() );
        }
        assetDetailResponse.assetNm( asset.getAssetNm() );
        assetDetailResponse.addr( asset.getAddr() );
        assetDetailResponse.assetSize( asset.getAssetSize() );
        assetDetailResponse.assetDesc( asset.getAssetDesc() );
        assetDetailResponse.createdAt( asset.getCreatedAt() );
        assetDetailResponse.updatedAt( asset.getUpdatedAt() );

        return assetDetailResponse.build();
    }

    @Override
    public AssetDetailResponse toAssetDetailResponse(TBAccount account) {
        if ( account == null ) {
            return null;
        }

        AssetDetailResponse.AssetDetailResponseBuilder assetDetailResponse = AssetDetailResponse.builder();

        assetDetailResponse.assetId( account.getAccountId() );
        assetDetailResponse.assetNm( account.getAccountNm() );
        assetDetailResponse.amount( account.getBalanceAmt() );
        if ( account.getAssetCateCd() != null ) {
            assetDetailResponse.assetCateCd( account.getAssetCateCd().name() );
        }
        assetDetailResponse.instNm( account.getInstNm() );
        assetDetailResponse.monthlyPremAmt( account.getMonthlyPremAmt() );
        assetDetailResponse.expireDt( account.getExpireDt() );
        assetDetailResponse.createdAt( account.getCreatedAt() );
        assetDetailResponse.updatedAt( account.getUpdatedAt() );

        return assetDetailResponse.build();
    }

    @Override
    public List<AssetDetailResponse> toAssetDetailListFromReal(List<TBRealAsset> assets) {
        if ( assets == null ) {
            return null;
        }

        List<AssetDetailResponse> list = new ArrayList<AssetDetailResponse>( assets.size() );
        for ( TBRealAsset tBRealAsset : assets ) {
            list.add( toAssetDetailResponse( tBRealAsset ) );
        }

        return list;
    }

    @Override
    public List<AssetDetailResponse> toAssetDetailListFromAccount(List<TBAccount> accounts) {
        if ( accounts == null ) {
            return null;
        }

        List<AssetDetailResponse> list = new ArrayList<AssetDetailResponse>( accounts.size() );
        for ( TBAccount tBAccount : accounts ) {
            list.add( toAssetDetailResponse( tBAccount ) );
        }

        return list;
    }

    @Override
    public List<AssetDashboardResponse.FinancialAssetSummary> toFinancialAssetSummaryList(List<Object[]> rows) {
        if ( rows == null ) {
            return null;
        }

        List<AssetDashboardResponse.FinancialAssetSummary> list = new ArrayList<AssetDashboardResponse.FinancialAssetSummary>( rows.size() );
        for ( Object[] objectArray : rows ) {
            list.add( toFinancialAssetSummary( objectArray ) );
        }

        return list;
    }

    @Override
    public List<AssetDashboardResponse.RealAssetSummary> toRealAssetSummaryList(List<Object[]> rows) {
        if ( rows == null ) {
            return null;
        }

        List<AssetDashboardResponse.RealAssetSummary> list = new ArrayList<AssetDashboardResponse.RealAssetSummary>( rows.size() );
        for ( Object[] objectArray : rows ) {
            list.add( toRealAssetSummary( objectArray ) );
        }

        return list;
    }
}
