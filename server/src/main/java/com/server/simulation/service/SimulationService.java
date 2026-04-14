package com.server.simulation.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.entity.TBAssetSimulation;
import com.server.asset.repository.TBAssetSimulationRepository;
import com.server.simulation.dto.request.SimulationRequest;
import com.server.simulation.dto.response.SimulationResponse;
import com.server.simulation.mapper.SimulationMapper;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SimulationService {

    private final TBAssetSimulationRepository tbAssetSimulationRepository;
    private final TBUserRepository tbUserRepository;
    private final SimulationMapper simulationMapper;

    @Transactional
    public SimulationResponse createSimulation(Long userId, SimulationRequest request) {
        TBUser user = tbUserRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // AI 분석 결과를 시뮬레이션하는 가상 로직
        BigDecimal totalIncomeAmt = new BigDecimal("1450000.00");
        BigDecimal monthlyCost = new BigDecimal("2300000.00");
        BigDecimal shortageAmt = monthlyCost.subtract(totalIncomeAmt);
        boolean isSufficient = shortageAmt.compareTo(BigDecimal.ZERO) <= 0;

        BigDecimal livingCost = new BigDecimal("1500000.00");
        BigDecimal medicalCost = new BigDecimal("500000.00");
        BigDecimal careCost = new BigDecimal("300000.00");

        TBAssetSimulation simulation = TBAssetSimulation.builder()
            .user(user)
            .targetAge(request.getTargetAge())
            .careType(request.getCareType())
            .totalIncomeAmt(totalIncomeAmt)
            .shortageAmt(shortageAmt)
            .isSufficient(isSufficient)
            .livingCost(livingCost)
            .medicalCost(medicalCost)
            .careCost(careCost)
            .monthlyCost(monthlyCost)
            .ageRangeDetails("{}") // AI 상세 리포트 (JSON)
            .build();

        TBAssetSimulation savedSimulation = tbAssetSimulationRepository.save(simulation);

        return simulationMapper.toSimulationResponse(savedSimulation);
    }
}
