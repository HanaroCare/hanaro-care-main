package com.server.asset.mapper;

import com.server.asset.dto.pension.PensionForecastChartPointDto;
import com.server.asset.dto.pension.PensionForecastInternalDto;
import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.dto.pension.PensionForecastScenarioDto;
import com.server.asset.dto.pension.PensionSimulationSummaryResponse;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.user.entity.TBUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring",
	imports = {ProdType.class, PayoutType.class, ProdStat.class, AssetCategory.class, BigDecimal.class})
public interface PensionMapper {

	// Scenario internal -> DTO
	PensionForecastScenarioDto toScenarioDto(PensionForecastInternalDto.Scenario scenario);
	List<PensionForecastScenarioDto> toScenarioDtos(List<PensionForecastInternalDto.Scenario> scenarios);

	// ChartPoint internal -> DTO
	PensionForecastChartPointDto toChartPointDto(PensionForecastInternalDto.ChartPoint chartPoint);
	List<PensionForecastChartPointDto> toChartPointDtos(List<PensionForecastInternalDto.ChartPoint> chartPoints);

	// TBRealAsset + Result -> PensionForecastResponse
	@Mapping(target = "realAssetId",         source = "asset.realAssetId")
	@Mapping(target = "assetNm",             source = "asset.assetNm")
	@Mapping(target = "currentPrice",        source = "asset.evalAmt")
	@Mapping(target = "periodYears",         source = "result.periodYears")
	@Mapping(target = "expectedPrice",       source = "result.expectedPrice")
	@Mapping(target = "scenarios",           source = "result.scenarios")
	@Mapping(target = "chartPoints",         source = "result.chartPoints")
	@Mapping(target = "recommendedScenario", source = "result.recommendedScenario")
	@Mapping(target = "marketSummary",       source = "result.marketSummary")
	@Mapping(target = "locationSummary",     source = "result.locationSummary")
	@Mapping(target = "recommendedReason",   source = "result.recommendedReason")
	@Mapping(target = "modelVersion",        source = "result.modelVersion")
	@Mapping(target = "predictedAt",         source = "result.predictedAt")
	PensionForecastResponse toForecastResponse(TBRealAsset asset, PensionForecastInternalDto.Result result);
	// TBPensionSimulation -> PensionSimulationSummaryResponse
	@Mapping(target = "recommendedType",             expression = "java(simulation.getRecommendedType().name())")
	@Mapping(target = "recommendedLabel",            expression = "java(simulation.getRecommendedType().getDescription())")
	@Mapping(target = "recommendedMonthlyAmount",    source = "recommendedMonthlyAmt")
	@Mapping(target = "recommendedCumulativeAmount", source = "recommendedCumulativeAmt")
	PensionSimulationSummaryResponse toSummaryResponse(TBPensionSimulation simulation);

	// TBPensionSimulation + TBUser + TBProduct -> TBUserProd
	@Mapping(target = "userProdId",        ignore = true)
	@Mapping(target = "user",              source = "user")
	@Mapping(target = "product",           source = "product")
	@Mapping(target = "prodType",          expression = "java(ProdType.HOUSING_PENSION)")
	@Mapping(target = "payoutType",        expression = "java(PayoutType.PENSION)")
	@Mapping(target = "pensionPayoutType", source = "simulation.recommendedType")
	@Mapping(target = "prodStat",          expression = "java(ProdStat.IN_PROGRESS)")
	@Mapping(target = "targetAsset",       source = "simulation.realAsset")
	@Mapping(target = "monthlyPayout",     source = "simulation.recommendedMonthlyAmt")
	@Mapping(target = "investType",        ignore = true)
	@Mapping(target = "principalAmount",   ignore = true)
	@Mapping(target = "profitRate",        ignore = true)
	@Mapping(target = "profit",            ignore = true)
	@Mapping(target = "startType",         ignore = true)
	@Mapping(target = "startDate",         ignore = true)
	@Mapping(target = "claimAgent",        ignore = true)
	@Mapping(target = "isAgentView",       constant = "false")
	@Mapping(target = "payoutSettings",    ignore = true)
	TBUserProd toUserProd(TBPensionSimulation simulation, TBUser user, TBProduct product);

	// TBUser + TBUserProd + BigDecimal + TBPensionSimulation -> TBAccount
	@Mapping(target = "accountId",      ignore = true)
	@Mapping(target = "user",           source = "user")
	@Mapping(target = "instNm",         constant = "한국주택금융공사")
	@Mapping(target = "accountNm",      expression = "java(\"주택연금 (\" + simulation.getRecommendedType().getDescription() + \")\")")
	@Mapping(target = "accountNum",     expression = "java(\"HF-\" + savedProd.getUserProdId())")
	@Mapping(target = "balanceAmt",     expression = "java(BigDecimal.ZERO)")
	@Mapping(target = "assetCateCd",    expression = "java(AssetCategory.PENSION)")
	@Mapping(target = "profitRate",     expression = "java(BigDecimal.ZERO)")
	@Mapping(target = "payAmt",         source = "monthlyPayout")
	@Mapping(target = "monthlyPremAmt", expression = "java(BigDecimal.ZERO)")
	@Mapping(target = "contrDt",        source = "savedProd.startDate")
	@Mapping(target = "limitAmt",       ignore = true)
	@Mapping(target = "payDay",         ignore = true)
	@Mapping(target = "expireDt",       ignore = true)
	TBAccount toPensionAccount(TBUser user, TBUserProd savedProd, BigDecimal monthlyPayout, TBPensionSimulation simulation);
}
