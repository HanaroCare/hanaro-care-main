package com.server.asset.service;

import com.server.asset.repository.AssetSimulationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SimulationAsyncService {

  private final SimulationService simulationService;
  private final AssetSimulationRepository assetSimulationRepository;

  @Async
  public void rerunAfterAssetChange(Long userId) {
    try {
      assetSimulationRepository.findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
          .ifPresentOrElse(
              last -> simulationService.rerunLatestSimulation(userId, last.getTargetAge(),
                  last.getCareType()),
              () -> simulationService.createDefaultSimulationForUser(userId)
          );
      log.info("[SimulationAsync] 재실행 완료: userId={}", userId);
    } catch (Exception e) {
      log.error("[SimulationAsync] 재실행 실패: userId={}, error={}", userId, e.getMessage(), e);
    }
  }
}
