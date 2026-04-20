package com.server.asset.scheduler;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationRefreshScheduler {

  private final JobLauncher jobLauncher;

  @Qualifier("simulationRefreshJob")
  private final Job simulationRefreshJob;

  /**
   * 매일 03:00에 시뮬레이션 재실행 배치 Job 시작. cron: 초 분 시 일 월 요일
   */
  @Scheduled(cron = "0 0 3 * * *")
  public void runSimulationRefreshJob() {
    triggerNow();
  }

  public void triggerNow() {
    JobParameters params = new JobParametersBuilder()
        .addString("runAt", LocalDateTime.now().toString())
        .toJobParameters();

    try {
      log.info("[SimulationRefreshScheduler] Job 시작: runAt={}", params.getString("runAt"));
      jobLauncher.run(simulationRefreshJob, params);
    } catch (Exception e) {
      log.error("[SimulationRefreshScheduler] Job 실행 실패", e);
    }
  }
}
