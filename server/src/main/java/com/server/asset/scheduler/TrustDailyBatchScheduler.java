package com.server.asset.scheduler;

import com.server.asset.service.TrustDailyBatchService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TrustDailyBatchScheduler {

	private final TrustDailyBatchService trustDailyBatchService;

	@Scheduled(cron = "0 0 1 * * *")
	public void settleDailyProfit() {
		LocalDate today = LocalDate.now();
		log.info("Trust daily batch started. date={}", today);
		trustDailyBatchService.settleDailyProfit(today);
		log.info("Trust daily batch finished. date={}", today);
	}
}
