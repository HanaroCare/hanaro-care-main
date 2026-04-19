package com.server.asset.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

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
