package com.server.asset.service;

import com.server.asset.repository.AssetSimulationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * 자산 변동 이벤트 발생 시 시뮬레이션 재실행 큐를 관리합니다.
 * <p>
 * Redis Set({@code simulation:refresh:queue})을 배치 큐로 사용합니다.
 * <ul>
 *   <li>이벤트 발생 시: {@code enqueue(userId)}로 큐에 userId 추가 (중복 자동 제거)</li>
 *   <li>스케줄러 실행 시: {@code processAll()}로 큐의 모든 userId를 꺼내 재시뮬레이션</li>
 * </ul>
 * <p>
 * 트리거되는 이벤트:
 * <ol>
 *   <li>신탁 상품 가입 ({@code AssetAdminService.subscribeTrustProduct})</li>
 *   <li>주택연금 상품 가입 ({@code AssetAdminService.subscribePensionProduct})</li>
 *   <li>마이데이터 금융자산 연동 변경 ({@code AssetService.updateAssetLinkStatus})</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SimulationRefreshService {

    static final String REFRESH_QUEUE_KEY = "simulation:refresh:queue";

    private final RedisTemplate<String, Object> redisTemplate;
    private final AssetSimulationRepository simulationRepository;
    private final SimulationService simulationService;

    /**
     * 재시뮬레이션이 필요한 userId를 큐에 추가합니다.
     * Redis Set이므로 동일 userId가 여러 번 들어와도 중복 처리되지 않습니다.
     */
    public void enqueue(Long userId) {
        redisTemplate.opsForSet().add(REFRESH_QUEUE_KEY, userId.toString());
        log.info("[SimulationRefresh] 큐 등록: userId={}", userId);
    }

    /**
     * 큐의 모든 userId를 꺼내 최신 시뮬레이션 파라미터(targetAge, careType)로 재실행합니다.
     * {@code SimulationRefreshScheduler}에서 주기적으로 호출됩니다.
     */
    public void processAll() {
        int processed = 0;
        String userIdStr;

        while ((userIdStr = popFromQueue()) != null) {
            Long userId = Long.parseLong(userIdStr);
            boolean reran = runIfSimulationExists(userId);
            if (reran) processed++;
        }

        if (processed > 0) {
            log.info("[SimulationRefresh] 배치 완료: {}건 재실행", processed);
        }
    }

    private String popFromQueue() {
        Object value = redisTemplate.opsForSet().pop(REFRESH_QUEUE_KEY);
        return value != null ? value.toString() : null;
    }

    private boolean runIfSimulationExists(Long userId) {
        return simulationRepository.findFirstByUser_UserIdOrderByCreatedAtDesc(userId)
                .map(last -> {
                    try {
                        simulationService.rerunLatestSimulation(userId, last.getTargetAge(), last.getCareType());
                        log.info("[SimulationRefresh] 재실행 완료: userId={}, targetAge={}, careType={}",
                                userId, last.getTargetAge(), last.getCareType());
                        return true;
                    } catch (Exception e) {
                        log.error("[SimulationRefresh] 재실행 실패: userId={}, error={}", userId, e.getMessage(), e);
                        return false;
                    }
                })
                .orElseGet(() -> {
                    log.warn("[SimulationRefresh] 시뮬레이션 이력 없음, 건너뜀: userId={}", userId);
                    return false;
                });
    }
}
