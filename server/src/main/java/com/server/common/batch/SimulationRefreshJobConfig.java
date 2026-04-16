package com.server.common.batch;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * 자산 변동 이벤트 기반 시뮬레이션 재실행 Spring Batch Job 설정.
 *
 * <pre>
 * Job: simulationRefreshJob
 *   Step: simulationRefreshStep (Tasklet)
 *     → Redis 큐에서 userId 소비 → AI 시뮬레이션 재실행 → DB 저장
 * </pre>
 *
 * Job 실행은 {@link com.server.asset.scheduler.SimulationRefreshScheduler}에서
 * {@code JobLauncher}를 통해 매일 새벽 3시에 트리거됩니다.
 */
@Configuration
@RequiredArgsConstructor
public class SimulationRefreshJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final SimulationRefreshTasklet simulationRefreshTasklet;

    @Bean
    public Job simulationRefreshJob(Step simulationRefreshStep) {
        return new JobBuilder("simulationRefreshJob", jobRepository)
                .start(simulationRefreshStep)
                .build();
    }

    @Bean
    public Step simulationRefreshStep() {
        return new StepBuilder("simulationRefreshStep", jobRepository)
                .tasklet(simulationRefreshTasklet, transactionManager)
                .build();
    }
}