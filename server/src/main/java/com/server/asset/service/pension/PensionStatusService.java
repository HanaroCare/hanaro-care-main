package com.server.asset.service.pension;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.pension.PensionPayoutHistoryResponse;
import com.server.asset.dto.pension.PensionPayoutHistoryResponse.PayoutRecord;
import com.server.asset.dto.pension.PensionPayoutPlanDto;
import com.server.asset.dto.pension.PensionPayoutYearlyDto;
import com.server.asset.dto.pension.PensionStatusResponse;
import com.server.asset.dto.pension.PensionStatusResponse.ChartPoint;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.PensionPayoutType;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.repository.TBPensionSimulationRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PensionStatusService {

	private final UserProdRepository userProdRepository;
	private final TBPensionSimulationRepository pensionSimulationRepository;
	private final ObjectMapper objectMapper;

	public PensionStatusResponse getStatus(Long userId) {
		TBUserProd userProd = userProdRepository
			.findByUser_UserIdAndProdTypeAndProdStat(userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_NOT_SUBSCRIBED));

		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(userProd.getTargetAsset().getRealAssetId())
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

		PensionPayoutType payoutType = userProd.getPensionPayoutType();

		List<PensionPayoutPlanDto> plans = deserializePlans(simulation.getPlansJson());
		PensionPayoutPlanDto plan = plans.stream()
			.filter(p -> p.getType().equals(payoutType.name()))
			.findFirst()
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

		LocalDate startDate = userProd.getStartDate();
		long totalMonths = calcTotalMonths(startDate);
		int elapsedYear = calcElapsedYear(totalMonths);

		List<PensionPayoutYearlyDto> yearlyData = plan.getYearlyData();

		// 현재 연차 이하의 yearlyData 중 가장 큰 연차 항목 (floor)
		PensionPayoutYearlyDto floorEntry = yearlyData.stream()
			.filter(d -> d.getYear() <= elapsedYear)
			.max(Comparator.comparingInt(PensionPayoutYearlyDto::getYear))
			.orElse(yearlyData.get(0));

		// 이달의 수령액: floor 연차의 월 수령액
		BigDecimal currentMonthlyPayout = floorEntry.getMonthlyAmount();

		// 누적 수령액: floor 연차 누적 + 초과 개월 수 보정
		long floorYearMonths = (long) floorEntry.getYear() * 12;
		long extraMonths = Math.max(0, totalMonths - floorYearMonths);
		BigDecimal currentCumulativeAmount = floorEntry.getCumulativeAmount()
			.add(currentMonthlyPayout.multiply(BigDecimal.valueOf(extraMonths)));

		// 차트: 현재 연차 ~ 20년차
		List<ChartPoint> chartPoints = yearlyData.stream()
			.filter(d -> d.getYear() >= floorEntry.getYear())
			.map(d -> ChartPoint.builder()
				.year(d.getYear())
				.monthlyAmount(d.getMonthlyAmount())
				.cumulativeAmount(d.getCumulativeAmount())
				.status(d.getYear() == floorEntry.getYear() ? "CURRENT" : "FUTURE")
				.build())
			.collect(Collectors.toList());

		return PensionStatusResponse.builder()
			.pensionPayoutType(payoutType.name())
			.pensionPayoutLabel(payoutType.getDescription())
			.startDate(startDate)
			.elapsedYear(elapsedYear)
			.currentMonthlyPayout(currentMonthlyPayout)
			.currentCumulativeAmount(currentCumulativeAmount)
			.chartPoints(chartPoints)
			.build();
	}

	public PensionPayoutHistoryResponse getPayoutHistory(Long userId) {
		TBUserProd userProd = userProdRepository
			.findByUser_UserIdAndProdTypeAndProdStat(userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_NOT_SUBSCRIBED));

		LocalDate startDate = userProd.getStartDate();
		if (startDate == null || startDate.isAfter(LocalDate.now())) {
			return PensionPayoutHistoryResponse.builder()
				.totalReceivedAmount(BigDecimal.ZERO)
				.history(List.of())
				.build();
		}

		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(userProd.getTargetAsset().getRealAssetId())
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

		List<PensionPayoutPlanDto> plans = deserializePlans(simulation.getPlansJson());
		PensionPayoutPlanDto plan = plans.stream()
			.filter(p -> p.getType().equals(userProd.getPensionPayoutType().name()))
			.findFirst()
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

		List<PensionPayoutYearlyDto> yearlyData = plan.getYearlyData();

		// startDate 부터 현재까지 월별 수령 내역 계산
		List<PayoutRecord> history = new ArrayList<>();
		BigDecimal total = BigDecimal.ZERO;
		LocalDate cursor = startDate;
		LocalDate now = LocalDate.now();

		while (!cursor.isAfter(now)) {
			long monthsSinceStart = ChronoUnit.MONTHS.between(startDate, cursor);
			int year = calcElapsedYear(monthsSinceStart);
			BigDecimal monthly = resolveMonthlyAmount(yearlyData, year);

			total = total.add(monthly);
			history.add(PayoutRecord.builder()
				.payoutDate(cursor)
				.amount(monthly)
				.build());

			cursor = cursor.plusMonths(1);
		}

		// 최신순 정렬
		Collections.reverse(history);

		return PensionPayoutHistoryResponse.builder()
			.totalReceivedAmount(total)
			.history(history)
			.build();
	}

	// ── 유틸 ────────────────────────────────────────────────────────────────────

	/** startDate 로부터 현재까지 경과 개월 수 (미래 or null 이면 0) */
	private long calcTotalMonths(LocalDate startDate) {
		if (startDate == null || startDate.isAfter(LocalDate.now())) {
			return 0;
		}
		return ChronoUnit.MONTHS.between(startDate, LocalDate.now());
	}

	/** 경과 개월 수 → 1-based 가입 연차 (최대 20) */
	private int calcElapsedYear(long totalMonths) {
		return (int) Math.min(totalMonths / 12 + 1, 20);
	}

	/** yearlyData에서 해당 연차의 월 수령액 반환 (floor 스냅샷 기준) */
	private BigDecimal resolveMonthlyAmount(List<PensionPayoutYearlyDto> yearlyData, int year) {
		return yearlyData.stream()
			.filter(d -> d.getYear() <= year)
			.max(Comparator.comparingInt(PensionPayoutYearlyDto::getYear))
			.orElse(yearlyData.get(0))
			.getMonthlyAmount();
	}

	private List<PensionPayoutPlanDto> deserializePlans(String plansJson) {
		try {
			return objectMapper.readValue(plansJson, new TypeReference<>() {});
		} catch (Exception e) {
			log.warn("플랜 JSON 역직렬화 실패", e);
			throw new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND);
		}
	}
}
