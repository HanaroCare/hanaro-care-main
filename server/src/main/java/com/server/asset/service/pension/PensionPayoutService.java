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
import com.server.asset.repository.PensionSimulationRepository;
import com.server.asset.repository.RealAssetRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

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

	private static final List<Integer> CHART_YEARS = buildChartYears();

	private static List<Integer> buildChartYears() {
		List<Integer> years = new ArrayList<>(List.of(1, 10, 11, 20));
		return years.stream().distinct().sorted().toList();
	}

	private static final Map<String, String> TYPE_LABELS = Map.of(
		"FIXED",        "정액형",
		"FRONT_LOADED", "초기증액형",
		"GROWING",      "정기증가형"
	);

	private final RealAssetRepository realAssetRepository;
	private final PensionSimulationRepository pensionSimulationRepository;
	private final ObjectMapper objectMapper;
	private final PensionMapper pensionMapper;

	@CheckUser(key = "#userId")
	@Transactional
	public PensionPayoutComparisonResponse compare(Long userId, Long realAssetId) {
		TBRealAsset asset = findAsset(realAssetId);
		validateOwner(userId, asset);
		BigDecimal currentEvalAmt = asset.getEvalAmt();

		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(realAssetId)
			.orElseGet(() -> TBPensionSimulation.builder().realAsset(asset).build());

		if (simulation.getPensionSimulationId() != null
			&& simulation.getEvalAmtSnapshot() != null
			&& simulation.getEvalAmtSnapshot().compareTo(currentEvalAmt) == 0) {
			return deserializePlans(simulation);
		}

		PensionPayoutComparisonResponse response = calculate(asset);
		updateSimulation(simulation, response, currentEvalAmt);

		try {
			pensionSimulationRepository.saveAndFlush(simulation);
		} catch (DataIntegrityViolationException e) {
			log.warn("중복된 시뮬레이션 생성 시도 감지. 기존 데이터를 갱신합니다. assetId={}", realAssetId);
			simulation = pensionSimulationRepository.findByRealAsset_RealAssetId(realAssetId)
				.orElseThrow(() -> new ApiException(ErrorStatus._INTERNAL_SERVER_ERROR));
			updateSimulation(simulation, response, currentEvalAmt);
		}

		return response;
	}

	@CheckUser(key = "#userId")
	@Transactional(readOnly = true)
	public PensionSimulationSummaryResponse getSummary(Long userId, Long realAssetId) {
		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(realAssetId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));
		validateOwner(userId, simulation.getRealAsset());

		return pensionMapper.toSummaryResponse(simulation);
	}

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

	private void updateSimulation(TBPensionSimulation simulation, PensionPayoutComparisonResponse response, BigDecimal evalAmt) {
		PensionPayoutPlanDto recommendedPlan = response.getPlans().stream()
			.filter(p -> p.getType().equals(response.getRecommendedType()))
			.findFirst()
			.orElseThrow(() -> new IllegalStateException("추천 플랜 누락"));

		BigDecimal monthlyAmt = recommendedPlan.getYearlyData().get(0).getMonthlyAmount();

		simulation.setRecommendedType(PensionPayoutType.valueOf(response.getRecommendedType()));
		simulation.setRecommendedMonthlyAmt(monthlyAmt);
		simulation.setRecommendedCumulativeAmt(recommendedPlan.getTotalCumulativeAmount());
		simulation.setEvalAmtSnapshot(evalAmt);
		// 핵심 변경: 직렬화 실패 시 런타임 예외 발생으로 롤백 유도
		simulation.setPlansJson(serializePlans(response.getPlans()));
	}

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

	private List<PensionPayoutYearlyDto> buildYearlyData(java.util.function.IntFunction<BigDecimal> monthlyByYear) {
		List<PensionPayoutYearlyDto> result = new ArrayList<>();
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
			log.error("주택연금 시뮬레이션 직렬화 실패", e);
			// null을 반환하여 오염된 데이터를 저장하는 대신 예외를 던져 롤백
			throw new ApiException(ErrorStatus._INTERNAL_SERVER_ERROR);
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
				.recommendedLabel(simulation.getRecommendedType().getDescription())
				.plans(plans)
				.build();
		} catch (Exception e) {
			log.warn("JSON 역직렬화 실패, 재계산 수행. id={}", simulation.getPensionSimulationId());
			return calculate(simulation.getRealAsset());
		}
	}
}
