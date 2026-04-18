package com.server.asset.scheduler;

import com.server.asset.service.pension.PensionMonthlyBatchService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PensionMonthlyBatchScheduler {

	private final PensionMonthlyBatchService pensionMonthlyBatchService;

	@Scheduled(cron = "0 0 0 * * *")
	public void creditDailyPensionPayout() {
		LocalDate today = LocalDate.now();
		log.info("Pension daily payout batch started. date={}", today);
		pensionMonthlyBatchService.creditDailyPensionPayout(today);
		log.info("Pension daily payout batch finished. date={}", today);
	}

	@Scheduled(cron = "0 0 2 25 * *")
	public void settleMonthlyPayout() {
		LocalDate today = LocalDate.now();
		log.info("Pension monthly batch started. date={}", today);
		pensionMonthlyBatchService.settleMonthlyPayout(today);
		log.info("Pension monthly batch finished. date={}", today);
	}
}
