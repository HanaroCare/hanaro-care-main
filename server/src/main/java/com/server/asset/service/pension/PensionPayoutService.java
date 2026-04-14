package com.server.asset.service.pension;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.pension.PensionPayoutComparisonResponse;
import com.server.asset.dto.pension.PensionPayoutPlanDto;
import com.server.asset.dto.pension.PensionPayoutYearlyDto;
import com.server.asset.dto.pension.PensionSimulationSummaryResponse;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBRealAsset;
import com.server.asset.entity.enums.PensionPayoutType;
import com.server.asset.mapper.PensionMapper;
import com.server.asset.repository.TBPensionSimulationRepository;
import com.server.asset.repository.TBRealAssetRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PensionPayoutService {

	private static final int COMPARISON_YEARS = 20;
	private static final BigDecimal BASE_MONTHLY_RATE   = new BigDecimal("0.0038");
	private static final BigDecimal FRONT_EARLY_RATIO   = new BigDecimal("1.20");
	private static final BigDecimal FRONT_LATE_RATIO    = new BigDecimal("0.73");
	private static final int        FRONT_BREAK_YEAR    = 10;
	private static final BigDecimal GROWING_START_RATIO = new BigDecimal("0.70");
	private static final BigDecimal GROWING_ANNUAL_RATE = new BigDecimal("0.035");

	// 차트용 연도: 1년부터 3년 단위, 마지막은 20년 포함
	private static final List<Integer> CHART_YEARS = buildChartYears();

	private static List<Integer> buildChartYears() {
		List<Integer> years = new java.util.ArrayList<>();
		for (int y = 1; y <= COMPARISON_YEARS; y += 3) {
			years.add(y);
		}
		if (!years.contains(COMPARISON_YEARS)) {
			years.add(COMPARISON_YEARS);
		}
		return List.copyOf(years);
	}

	private static final Map<String, String> TYPE_LABELS = Map.of(
		"FIXED",        "정액형",
		"FRONT_LOADED", "초기증액형",
		"GROWING",      "정기증가형"
	);

	private final TBRealAssetRepository realAssetRepository;
	private final TBPensionSimulationRepository pensionSimulationRepository;
	private final ObjectMapper objectMapper;
	private final PensionMapper pensionMapper;

	// ── 상세 비교 (저장/캐시) ─────────────────────────────────────────────────────

	@CheckUser(key = "#userId")
	@Transactional
	public PensionPayoutComparisonResponse compare(Long userId, Long realAssetId) {
		TBRealAsset asset = findAsset(realAssetId);
		validateOwner(userId, asset);
		BigDecimal currentEvalAmt = asset.getEvalAmt();

		Optional<TBPensionSimulation> existing =
			pensionSimulationRepository.findByRealAsset_RealAssetId(realAssetId);

		// 저장된 결과가 있고 집값이 변하지 않았으면 캐시 반환
		if (existing.isPresent()
			&& existing.get().getEvalAmtSnapshot().compareTo(currentEvalAmt) == 0) {
			return deserializePlans(existing.get());
		}

		// 계산
		PensionPayoutComparisonResponse response = calculate(asset);

		// 저장 or 갱신
		TBPensionSimulation simulation = existing.orElseGet(() ->
			TBPensionSimulation.builder().realAsset(asset).build()
		);
		updateSimulation(simulation, response, currentEvalAmt);
		pensionSimulationRepository.save(simulation);

		return response;
	}

	// ── 요약 카드 (빠른 조회) ─────────────────────────────────────────────────────

	@CheckUser(key = "#userId")
	@Transactional(readOnly = true)
	public PensionSimulationSummaryResponse getSummary(Long userId, Long realAssetId) {
		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(realAssetId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));
		validateOwner(userId, simulation.getRealAsset());

		return pensionMapper.toSummaryResponse(simulation);
	}

	// ── 계산 로직 ────────────────────────────────────────────────────────────────

	private PensionPayoutComparisonResponse calculate(TBRealAsset asset) {
		BigDecimal baseMonthly = asset.getEvalAmt()
			.multiply(BASE_MONTHLY_RATE)
			.setScale(0, RoundingMode.HALF_UP);

		PensionPayoutPlanDto fixed       = buildFixed(baseMonthly);
		PensionPayoutPlanDto frontLoaded = buildFrontLoaded(baseMonthly);
		PensionPayoutPlanDto growing     = buildGrowing(baseMonthly);

		List<PensionPayoutPlanDto> plans = List.of(fixed, frontLoaded, growing);

		PensionPayoutPlanDto recommended = plans.stream()
			.max(Comparator.comparing(PensionPayoutPlanDto::getTotalCumulativeAmount))
			.orElse(fixed);

		return PensionPayoutComparisonResponse.builder()
			.recommendedType(recommended.getType())
			.recommendedLabel(recommended.getLabel())
			.plans(plans)
			.build();
	}

	private void updateSimulation(
		TBPensionSimulation simulation,
		PensionPayoutComparisonResponse response,
		BigDecimal evalAmt
	) {
		PensionPayoutPlanDto recommendedPlan = response.getPlans().stream()
			.filter(p -> p.getType().equals(response.getRecommendedType()))
			.findFirst()
			.orElseThrow();

		BigDecimal monthlyAmt = recommendedPlan.getYearlyData().get(0).getMonthlyAmount();
		BigDecimal cumulativeAmt = recommendedPlan.getTotalCumulativeAmount();

		simulation.setRecommendedType(PensionPayoutType.valueOf(response.getRecommendedType()));
		simulation.setRecommendedMonthlyAmt(monthlyAmt);
		simulation.setRecommendedCumulativeAmt(cumulativeAmt);
		simulation.setEvalAmtSnapshot(evalAmt);
		simulation.setPlansJson(serializePlans(response.getPlans()));
	}

	// ── 방식별 플랜 생성 ─────────────────────────────────────────────────────────

	private PensionPayoutPlanDto buildFixed(BigDecimal baseMonthly) {
		return toPlan("FIXED", buildYearlyData(year -> baseMonthly));
	}

	private PensionPayoutPlanDto buildFrontLoaded(BigDecimal baseMonthly) {
		BigDecimal early = baseMonthly.multiply(FRONT_EARLY_RATIO).setScale(0, RoundingMode.HALF_UP);
		BigDecimal late  = baseMonthly.multiply(FRONT_LATE_RATIO).setScale(0, RoundingMode.HALF_UP);
		return toPlan("FRONT_LOADED", buildYearlyData(year -> year <= FRONT_BREAK_YEAR ? early : late));
	}

	private PensionPayoutPlanDto buildGrowing(BigDecimal baseMonthly) {
		BigDecimal start = baseMonthly.multiply(GROWING_START_RATIO).setScale(0, RoundingMode.HALF_UP);
		return toPlan("GROWING", buildYearlyData(year -> {
			BigDecimal factor = BigDecimal.ONE.add(GROWING_ANNUAL_RATE)
				.pow(year - 1, new MathContext(10, RoundingMode.HALF_UP));
			return start.multiply(factor).setScale(0, RoundingMode.HALF_UP);
		}));
	}

	// ── 공통 유틸 ────────────────────────────────────────────────────────────────

	private List<PensionPayoutYearlyDto> buildYearlyData(java.util.function.IntFunction<BigDecimal> monthlyByYear) {
		List<PensionPayoutYearlyDto> result = new java.util.ArrayList<>();
		BigDecimal cumulative = BigDecimal.ZERO;

		for (int year = 1; year <= COMPARISON_YEARS; year++) {
			BigDecimal monthly = monthlyByYear.apply(year);
			cumulative = cumulative.add(monthly.multiply(BigDecimal.valueOf(12)));

			if (CHART_YEARS.contains(year)) {
				result.add(PensionPayoutYearlyDto.builder()
					.year(year)
					.monthlyAmount(monthly)
					.cumulativeAmount(cumulative)
					.build());
			}
		}
		return List.copyOf(result);
	}

	private PensionPayoutPlanDto toPlan(String type, List<PensionPayoutYearlyDto> yearlyData) {
		return PensionPayoutPlanDto.builder()
			.type(type)
			.label(TYPE_LABELS.get(type))
			.totalCumulativeAmount(yearlyData.get(yearlyData.size() - 1).getCumulativeAmount())
			.yearlyData(yearlyData)
			.build();
	}

	private TBRealAsset findAsset(Long realAssetId) {
		TBRealAsset asset = realAssetRepository.findByRealAssetId(realAssetId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_ASSET_NOT_FOUND));
		if (asset.getEvalAmt() == null || asset.getEvalAmt().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ApiException(ErrorStatus.PENSION_NO_EVAL_AMT);
		}
		return asset;
	}

	private void validateOwner(Long userId, TBRealAsset asset) {
		if (!asset.getUser().getUserId().equals(userId)) {
			throw new ApiException(ErrorStatus._FORBIDDEN);
		}
	}

	private String serializePlans(List<PensionPayoutPlanDto> plans) {
		try {
			return objectMapper.writeValueAsString(plans);
		} catch (Exception e) {
			log.warn("플랜 JSON 직렬화 실패", e);
			return null;
		}
	}

	private PensionPayoutComparisonResponse deserializePlans(TBPensionSimulation simulation) {
		try {
			List<PensionPayoutPlanDto> plans = objectMapper.readValue(
				simulation.getPlansJson(),
				new TypeReference<>() {}
			);
			return PensionPayoutComparisonResponse.builder()
				.recommendedType(simulation.getRecommendedType().name())
				.recommendedLabel(simulation.getRecommendedType().getLabel())
				.plans(plans)
				.build();
		} catch (Exception e) {
			log.warn("플랜 JSON 역직렬화 실패, 재계산합니다. id={}", simulation.getPensionSimulationId(), e);
			return calculate(simulation.getRealAsset());
		}
	}
}
