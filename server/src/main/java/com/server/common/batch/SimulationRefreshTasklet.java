package com.server.common.batch;

import com.server.asset.repository.AssetSimulationRepository;
import com.server.asset.service.SimulationRefreshService;
import com.server.asset.service.SimulationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

/**
 * 자산 변동 이벤트로 Redis 큐에 쌓인 userId에 대해 병원비 시뮬레이션을 재실행하는 Tasklet.
 * <p>
 * 실행 흐름:
 * <ol>
 *   <li>Redis Set(simulation:refresh:queue)에서 userId를 하나씩 꺼냄</li>
 *   <li>해당 userId의 가장 최근 시뮬레이션 파라미터(targetAge, careType) 조회</li>
 *   <li>동일 파라미터로 AI 시뮬레이션 재실행 후 새 TBAssetSimulation 저장</li>
 *   <li>큐가 빌 때까지 반복 → {@code RepeatStatus.FINISHED} 반환</li>
 * </ol>
 * 한 건이 실패해도 나머지 건은 계속 처리됩니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationRefreshTasklet implements Tasklet {

    private final RedisTemplate<String, Object> redisTemplate;
    private final AssetSimulationRepository simulationRepository;
    private final SimulationService simulationService;

    @Override
    public RepeatStatus execute(@NonNull StepContribution contribution, @NonNull ChunkContext chunkContext) {
        int processed = 0;
        int skipped = 0;
        int failed = 0;

        String userIdStr;
        while ((userIdStr = popFromQueue()) != null) {
            Long userId = Long.parseLong(userIdStr);

            try {
                boolean ran = simulationRepository
                        .findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
                        .map(last -> {
                            simulationService.rerunLatestSimulation(
                                    userId, last.getTargetAge(), last.getCareType());
                            return true;
                        })
                        .orElse(false);

                if (ran) {
                    processed++;
                    contribution.incrementWriteCount();
                    log.info("[Batch] 재실행 완료: userId={}", userId);
                } else {
                    skipped++;
                    log.warn("[Batch] 시뮬레이션 이력 없음, 건너뜀: userId={}", userId);
                }
            } catch (Exception e) {
                failed++;
                contribution.incrementWriteSkipCount();
                log.error("[Batch] 재실행 실패: userId={}, error={}", userId, e.getMessage(), e);
            }
        }

        log.info("[Batch] 처리 결과 — 성공: {}, 건너뜀: {}, 실패: {}", processed, skipped, failed);
        return RepeatStatus.FINISHED;
    }

    private String popFromQueue() {
        Object value = redisTemplate.opsForSet().pop(SimulationRefreshService.REFRESH_QUEUE_KEY);
        return value != null ? value.toString() : null;
    }
}