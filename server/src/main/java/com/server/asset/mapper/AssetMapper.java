package com.server.asset.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import com.server.asset.entity.TBAccount;
import com.server.asset.dto.response.FinancialAssetResponse;

@Mapper(componentModel = "spring")
public interface AssetMapper {
    FinancialAssetResponse toFinancialAssetResponse(TBAccount account);
    List<FinancialAssetResponse> toFinancialAssetResponseList(List<TBAccount> accounts);
}
