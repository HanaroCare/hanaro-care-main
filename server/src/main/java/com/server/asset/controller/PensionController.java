package com.server.asset.controller;

import com.server.asset.dto.pension.PensionForecastResponse;
import com.server.asset.service.pension.PensionForecastService;
import com.server.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asset/pension")
@RequiredArgsConstructor
@Tag(name = "주택연금 API", description = "주택연금 관련 집값 예측 API입니다.")
public class PensionController {

	private final PensionForecastService pensionForecastService;

	@Operation(
		summary = "주택 자산 미래 가격 예측",
		description = "사용자가 보유한 주택 자산을 선택하면 해당 주택의 가격을 시나리오별로 예측하여 반환합니다."
	)
	@GetMapping("/{realAssetId}/forecast")
	public ResponseEntity<ApiResponse<PensionForecastResponse>> getForecast(
		@PathVariable Long realAssetId,
		@RequestParam(defaultValue = "5") Integer periodYears
	) {
		PensionForecastResponse response = pensionForecastService.getForecast(realAssetId, periodYears);
		return ResponseEntity.ok(ApiResponse.onSuccess(response));
	}
}
