package com.server.asset.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.dto.response.SimulationResponse;
import com.server.asset.dto.response.SimulationSummaryResponse;
import com.server.asset.dto.response.SimulationDetailResponse;
import java.util.List;

@Mapper(componentModel = "spring")
public interface SimulationMapper {

    @Mapping(target = "simulationId", source = "simulationId")
    @Mapping(target = "summary.isSufficient", source = "isSufficient")
    @Mapping(target = "summary.monthlyShortageAmt", source = "shortageAmt")
    @Mapping(target = "summary.totalIncomeAmt", source = "totalIncomeAmt")
    @Mapping(target = "summary.totalMonthlyCost", source = "monthlyCost")
    @Mapping(target = "currentSpending.living", source = "livingCost")
    @Mapping(target = "currentSpending.medical", source = "medicalCost")
    @Mapping(target = "currentSpending.care", source = "careCost")
    SimulationResponse toSimulationResponse(TBAssetSimulation simulation);

    @Mapping(target = "isSufficient", source = "simulation.isSufficient")
    @Mapping(target = "shortageAmt", source = "simulation.shortageAmt")
    @Mapping(target = "livingCost", source = "simulation.livingCost")
    @Mapping(target = "medicalCost", source = "simulation.medicalCost")
    @Mapping(target = "careCost", source = "simulation.careCost")
    @Mapping(target = "ageSegments", source = "ageSegments")
    @Mapping(target = "aiOpinion", source = "aiOpinion")
    SimulationSummaryResponse toSimulationSummaryResponse(TBAssetSimulation simulation, List<SimulationDetailResponse.AgeSegment> ageSegments, String aiOpinion);
}
