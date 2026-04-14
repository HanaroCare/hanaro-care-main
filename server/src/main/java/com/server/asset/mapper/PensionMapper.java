package com.server.asset.mapper;

import com.server.asset.dto.pension.PensionForecastChartPointDto;
import com.server.asset.dto.pension.PensionForecastInternalDto;
import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.dto.pension.PensionForecastScenarioDto;
import com.server.asset.dto.pension.PensionSimulationSummaryResponse;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBRealAsset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PensionMapper {

	// ── Scenario internal → DTO ───────────────────────────────────────────────
	PensionForecastScenarioDto toScenarioDto(PensionForecastInternalDto.Scenario scenario);
	List<PensionForecastScenarioDto> toScenarioDtos(List<PensionForecastInternalDto.Scenario> scenarios);

	// ── ChartPoint internal → DTO ─────────────────────────────────────────────
	PensionForecastChartPointDto toChartPointDto(PensionForecastInternalDto.ChartPoint chartPoint);
	List<PensionForecastChartPointDto> toChartPointDtos(List<PensionForecastInternalDto.ChartPoint> chartPoints);

	// ── TBRealAsset + Result → PensionForecastResponse ────────────────────────
	@Mapping(target = "realAssetId",        source = "asset.realAssetId")
	@Mapping(target = "assetNm",            source = "asset.assetNm")
	@Mapping(target = "currentPrice",       source = "asset.evalAmt")
	@Mapping(target = "periodYears",        source = "result.periodYears")
	@Mapping(target = "expectedPrice",      source = "result.expectedPrice")
	@Mapping(target = "scenarios",          source = "result.scenarios")
	@Mapping(target = "chartPoints",        source = "result.chartPoints")
	@Mapping(target = "recommendedScenario",source = "result.recommendedScenario")
	@Mapping(target = "recommendedReason",  source = "result.recommendedReason")
	@Mapping(target = "modelVersion",       source = "result.modelVersion")
	@Mapping(target = "predictedAt",        source = "result.predictedAt")
	PensionForecastResponse toForecastResponse(TBRealAsset asset, PensionForecastInternalDto.Result result);

	// ── TBPensionSimulation → PensionSimulationSummaryResponse ────────────────
	@Mapping(target = "recommendedType",             expression = "java(simulation.getRecommendedType().name())")
	@Mapping(target = "recommendedLabel",            expression = "java(simulation.getRecommendedType().getLabel())")
	@Mapping(target = "recommendedMonthlyAmount",    source = "recommendedMonthlyAmt")
	@Mapping(target = "recommendedCumulativeAmount", source = "recommendedCumulativeAmt")
	PensionSimulationSummaryResponse toSummaryResponse(TBPensionSimulation simulation);
}
