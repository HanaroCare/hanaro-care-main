package com.server.asset.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.asset.dto.admin.AdminRealAssetResponse;
import com.server.asset.dto.admin.AdminUserDetailResponse;
import com.server.asset.dto.admin.AdminUserSearchResponse;
import com.server.asset.service.AssetAdminService;
import com.server.asset.service.SimulationRefreshService;
import com.server.asset.service.TrustDailyBatchService;
import com.server.asset.service.pension.PensionMonthlyBatchService;
import com.server.common.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin/asset")
@RequiredArgsConstructor
@Tag(name = "관리자(테스트) API", description = "자산 관련 테스트 간편화를 위한 API입니다")
@PreAuthorize("hasRole('ADMIN')")
public class AssetAdminController {

	private final AssetAdminService trustAdminService;
	private final SimulationRefreshService simulationRefreshService;
	private final JobLauncher jobLauncher;

	@Qualifier("simulationRefreshJob")
	private final Job simulationRefreshJob;
	private final PensionMonthlyBatchService pensionMonthlyBatchService;
	private final TrustDailyBatchService trustDailyBatchService;

	@PostMapping("/trust/subscribe")
	@Operation(
		summary = "신탁 상품 가입 (관리자)",
		description = "지정한 유저의 저장된 신탁 설계 조건을 바탕으로 신탁 상품 가입 처리를 합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "가입 성공",
			content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": true,
                "code": "COMMON200",
                "message": "성공입니다.",
                "result": 125
              }
              """))
		)
	})
	public ApiResponse<Long> subscribeTrustProduct(
		@Parameter(description = "가입 처리할 대상 유저 ID", required = true)
		@RequestParam Long userId
	) {
		Long userProdId = trustAdminService.subscribeTrustProduct(userId);
		return ApiResponse.onSuccess(userProdId);
	}

	@PostMapping("/pension/subscribe")
	@Operation(
		summary = "주택연금 상품 가입 (관리자)",
		description = "지정한 유저의 저장된 주택연금 비교 시뮬레이션 결과를 바탕으로 주택연금 상품 가입 처리를 합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "가입 성공",
			content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": true,
                "code": "COMMON200",
                "message": "성공입니다.",
                "result": 126
              }
              """))
		)
	})
	public ApiResponse<Long> subscribePensionProduct(
		@Parameter(description = "가입 처리할 대상 유저 ID", required = true)
		@RequestParam Long userId,
		@Parameter(description = "주택연금 대상 부동산 자산 ID", required = true)
		@RequestParam Long realAssetId
	) {
		Long userProdId = trustAdminService.subscribePensionProduct(userId, realAssetId);
		return ApiResponse.onSuccess(userProdId);
	}

	@PostMapping("/simulation/enqueue")
	@Operation(
		summary = "시뮬레이션 재실행 큐 등록 (관리자)",
		description = "지정한 userId를 Redis 큐에 등록합니다. /simulation/batch-run과 함께 사용하세요."
	)
	public ApiResponse<String> enqueueSimulation(@RequestParam Long userId) {
		simulationRefreshService.enqueue(userId);
		return ApiResponse.onSuccess("userId=" + userId + " 큐 등록 완료");
	}

	@PostMapping("/simulation/batch-run")
	@Operation(
		summary = "시뮬레이션 재실행 배치 즉시 실행 (관리자)",
		description = "Redis 큐에 쌓인 userId에 대해 시뮬레이션 재실행 배치 Job을 즉시 실행합니다."
	)
	public ApiResponse<String> runSimulationBatch() {
		JobParameters params = new JobParametersBuilder()
			.addString("runAt", LocalDateTime.now().toString())
			.toJobParameters();
		try {
			jobLauncher.run(simulationRefreshJob, params);
			log.info("[Admin] 시뮬레이션 재실행 배치 수동 실행 완료");
			return ApiResponse.onSuccess("배치 실행 완료");
		} catch (Exception e) {
			log.error("[Admin] 배치 실행 실패", e);

			return ApiResponse.onFailure("COMMON500", "배치 실행 실패: " + e.getMessage(), null);
		}
	}

	@PostMapping("/trust/agent-view")
	@Operation(
		summary = "대리인 신탁 열람 권한 허용 (관리자)",
		description = "지정한 유저가 가입 중인 신탁 상품의 대리인 열람 권한(isAgentView)을 true로 설정합니다."
	)
	@ApiResponses({
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "권한 설정 성공",
			content = @Content(examples = @ExampleObject(value = """
              {
                "isSuccess": true,
                "code": "COMMON200",
                "message": "성공입니다.",
                "result": "대리인 열람 권한 허용 처리가 완료되었습니다."
              }
              """))
		)
	})
	public ApiResponse<String> enableAgentView(
		@Parameter(description = "권한 설정할 대상 유저 ID", required = true)
		@RequestParam Long userId
	) {
		trustAdminService.enableAgentView(userId);
		return ApiResponse.onSuccess("대리인 열람 권한 허용 처리가 완료되었습니다.");
	}

	@GetMapping("/users/search")
	@Operation(
		summary = "관리자 사용자 검색",
		description = "이름, 로그인 아이디, 전화번호로 사용자를 검색합니다."
	)
	public ApiResponse<List<AdminUserSearchResponse>> searchUsers(
		@Parameter(description = "검색 키워드", required = true)
		@RequestParam String keyword
	) {
		return ApiResponse.onSuccess(trustAdminService.searchUsers(keyword));
	}

	@GetMapping("/users/{userId}")
	@Operation(
		summary = "관리자 사용자 상세 조회",
		description = "선택한 사용자의 기본 정보를 조회합니다."
	)
	public ApiResponse<AdminUserDetailResponse> getUserDetail(
		@Parameter(description = "조회 대상 유저 ID", required = true)
		@PathVariable Long userId
	) {
		return ApiResponse.onSuccess(trustAdminService.getUserDetail(userId));
	}

	@GetMapping("/users/{userId}/real-assets")
	@Operation(
		summary = "관리자 사용자 부동산 자산 조회",
		description = "선택한 사용자의 부동산 자산 목록을 조회합니다."
	)
	public ApiResponse<List<AdminRealAssetResponse>> getUserRealAssets(
		@Parameter(description = "조회 대상 유저 ID", required = true)
		@PathVariable Long userId
	) {
		return ApiResponse.onSuccess(trustAdminService.getUserRealAssets(userId));
	}

	@PostMapping("/batch/pension")
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

	@PostMapping("/batch/trust")
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
