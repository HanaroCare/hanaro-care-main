package com.server.asset.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 자산 변동 이벤트 발생 시 시뮬레이션 재실행이 필요한 userId를 Redis 큐에 등록합니다.
 * <p>
 * Redis Set({@code simulation:refresh:queue})을 배치 큐로 사용합니다.
 * Set 자료구조이므로 동일 userId가 여러 이벤트로 중복 등록되어도 한 번만 처리됩니다.
 * <p>
 * 큐 소비는 {@link com.server.asset.batch.SimulationRefreshTasklet}에서 수행하며,
 * {@link com.server.asset.scheduler.SimulationRefreshScheduler}가 배치 Job을 트리거합니다.
 * <p>
 * 트리거되는 이벤트:
 * <ol>
 *   <li>신탁 상품 가입 ({@link AssetAdminService#subscribeTrustProduct})</li>
 *   <li>주택연금 상품 가입 ({@link AssetAdminService#subscribePensionProduct})</li>
 *   <li>마이데이터 금융자산 연동 변경 ({@link AssetService#updateAssetLinkStatus})</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SimulationRefreshService {

    public static final String REFRESH_DEDUPE_SET = "simulation:refresh:dedupe";
    public static final String REFRESH_LIST_QUEUE = "simulation:refresh:queue";

    private final RedisTemplate<String, Object> redisTemplate;

    public void enqueue(Long userId) {
        String userIdStr = userId.toString();

        Long addedCount = redisTemplate.opsForSet().add(REFRESH_DEDUPE_SET, userIdStr);

        if (addedCount != null && addedCount > 0) {
            redisTemplate.opsForList().leftPush(REFRESH_LIST_QUEUE, userIdStr);
            log.info("[SimulationRefresh] 신규 큐 등록: userId={}", userId);
        } else {
            log.info("[SimulationRefresh] 등록 생략 (중복 또는 오류): userId={}", userId);
        }
    }
}
