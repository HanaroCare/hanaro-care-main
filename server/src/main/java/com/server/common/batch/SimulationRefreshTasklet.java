package com.server.common.batch;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.server.asset.repository.AssetSimulationRepository;
import com.server.asset.service.SimulationRefreshService;
import com.server.asset.service.SimulationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
        String userIdStr;
        while ((userIdStr = (String) redisTemplate.opsForList().rightPop(SimulationRefreshService.REFRESH_LIST_QUEUE)) != null) {
            try {
                // 파싱과 모든 비즈니스 로직을 try 내부로 이동
                Long userId = Long.parseLong(userIdStr);

                boolean ran = simulationRepository
                    .findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
                    .map(last -> {
                        simulationService.rerunLatestSimulation(userId, last.getTargetAge(), last.getCareType());
                        return true;
                    })
                    .orElse(false);

                if (ran) {
                    // [성공] 처리가 완료된 후에만 Dedupe Set에서 제거
                    redisTemplate.opsForSet().remove(SimulationRefreshService.REFRESH_DEDUPE_SET, userIdStr);
                    contribution.incrementWriteCount(1L);
                    log.info("[Batch] 재실행 완료: userId={}", userId);
                } else {
                    // 이력이 없는 경우도 Set에서 지워야 나중에 다시 시뮬레이션 시 진입 가능
                    redisTemplate.opsForSet().remove(SimulationRefreshService.REFRESH_DEDUPE_SET, userIdStr);
                    log.warn("[Batch] 시뮬레이션 이력 없음: userId={}", userId);
                }
            } catch (NumberFormatException nfe) {
                // 잘못된 형식의 데이터는 복구 불가능하므로 Set에서도 삭제
                redisTemplate.opsForSet().remove(SimulationRefreshService.REFRESH_DEDUPE_SET, userIdStr);
                log.error("[Batch] 잘못된 userId 형식: {}", userIdStr);
            } catch (Exception e) {
                // [실패] 일시적인 장애(AI API, DB 등) 시 큐에 다시 넣어 다음 주기에 재시도
                redisTemplate.opsForList().leftPush(SimulationRefreshService.REFRESH_LIST_QUEUE, userIdStr);
                contribution.incrementWriteSkipCount();
                log.error("[Batch] 처리 실패로 큐 복구: userId={}, error={}", userIdStr, e.getMessage());
            }
        }
        return RepeatStatus.FINISHED;
    }
}
