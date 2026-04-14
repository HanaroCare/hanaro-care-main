package com.server.simulation.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.server.asset.entity.TBAssetSimulation;
import com.server.simulation.dto.response.SimulationResponse;

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
}
