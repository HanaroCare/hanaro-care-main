package com.server.asset.controller;

import com.server.asset.service.TrustDailyBatchService;
import com.server.asset.service.pension.PensionMonthlyBatchService;
import com.server.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test/batch")
@RequiredArgsConstructor
@Tag(name = "배치 테스트 API", description = "주택연금/신탁 배치를 수동 실행하기 위한 테스트용 API입니다.")
public class BatchTestController {

	private final PensionMonthlyBatchService pensionMonthlyBatchService;
	private final TrustDailyBatchService trustDailyBatchService;

	@PostMapping("/pension")
	@Operation(
		summary = "주택연금 월배치 수동 실행",
		description = "지정한 날짜 기준으로 주택연금 월배치를 수동 실행합니다. date를 생략하면 오늘 날짜로 실행합니다."
	)
	public ResponseEntity<ApiResponse<String>> runPensionBatch(
		@RequestParam(required = false)
		@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
		LocalDate date
	) {
		LocalDate targetDate = date != null ? date : LocalDate.now();
		pensionMonthlyBatchService.settleMonthlyPayout(targetDate);
		return ResponseEntity.ok(ApiResponse.onSuccess("주택연금 배치 실행 완료: " + targetDate));
	}

	@PostMapping("/trust")
	@Operation(
		summary = "신탁 일배치 수동 실행",
		description = "지정한 날짜 기준으로 신탁 일배치를 수동 실행합니다. date를 생략하면 오늘 날짜로 실행합니다."
	)
	public ResponseEntity<ApiResponse<String>> runTrustBatch(
		@RequestParam(required = false)
		@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
		LocalDate date
	) {
		LocalDate targetDate = date != null ? date : LocalDate.now();
		trustDailyBatchService.settleDailyProfit(targetDate);
		return ResponseEntity.ok(ApiResponse.onSuccess("신탁 배치 실행 완료: " + targetDate));
	}
}
