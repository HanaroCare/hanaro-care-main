package com.server.asset.scheduler;

import com.server.asset.service.SimulationRefreshService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 자산 변동 이벤트에 의해 Redis 큐에 쌓인 시뮬레이션 재실행 요청을 처리하는 스케줄러.
 * <p>
 * 매일 새벽 3시에 실행되며, 큐에 userId가 없으면 아무 작업도 하지 않습니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationRefreshScheduler {

    private final SimulationRefreshService simulationRefreshService;

    /**
     * 매일 03:00 에 큐를 소비하여 재시뮬레이션 수행.
     * cron: 초 분 시 일 월 요일
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void runRefreshBatch() {
        log.info("[SimulationRefreshScheduler] 배치 시작");
        simulationRefreshService.processAll();
        log.info("[SimulationRefreshScheduler] 배치 종료");
    }
}
