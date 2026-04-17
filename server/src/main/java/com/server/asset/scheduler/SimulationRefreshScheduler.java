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

/**
 * 매일 새벽 3시에 {@code simulationRefreshJob}을 실행하는 스케줄러.
 * <p>
 * JobParameters에 실행 시각({@code runAt})을 포함시켜
 * 같은 날 재실행해도 Spring Batch가 새 JobExecution으로 인식하도록 합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationRefreshScheduler {

    private final JobLauncher jobLauncher;

    @Qualifier("simulationRefreshJob")
    private final Job simulationRefreshJob;

    /**
     * 매일 03:00에 시뮬레이션 재실행 배치 Job 시작.
     * cron: 초 분 시 일 월 요일
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void runSimulationRefreshJob() {
        triggerNow();
    }

    /**
     * 자산 변동 이벤트(주택연금/신탁 가입 등) 발생 시 즉시 배치 Job을 실행합니다.
     * 스케줄러의 정기 실행과 동일한 Job을 실행하며, runAt 파라미터로 매 실행을 고유하게 식별합니다.
     */
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
