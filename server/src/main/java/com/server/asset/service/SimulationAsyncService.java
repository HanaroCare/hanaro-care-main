package com.server.asset.service;

import com.server.asset.repository.AssetSimulationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 자산 변동 이벤트 후 시뮬레이션을 비동기로 즉시 재실행합니다.
 * SimulationService와 별도 빈으로 분리해야 @Async 프록시가 정상 동작합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SimulationAsyncService {

    private final SimulationService simulationService;
    private final AssetSimulationRepository assetSimulationRepository;

    /**
     * 가장 최근 시뮬레이션 파라미터(targetAge, careType)를 그대로 사용해
     * AI 시뮬레이션을 백그라운드 스레드에서 즉시 재실행합니다.
     * 이전 시뮬레이션이 없으면 기본값으로 생성합니다.
     */
    @Async
    public void rerunAfterAssetChange(Long userId) {
        try {
            assetSimulationRepository.findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
                .ifPresentOrElse(
                    last -> simulationService.rerunLatestSimulation(userId, last.getTargetAge(), last.getCareType()),
                    () -> simulationService.createDefaultSimulationForUser(userId)
                );
            log.info("[SimulationAsync] 재실행 완료: userId={}", userId);
        } catch (Exception e) {
            log.error("[SimulationAsync] 재실행 실패: userId={}, error={}", userId, e.getMessage(), e);
        }
    }
}
