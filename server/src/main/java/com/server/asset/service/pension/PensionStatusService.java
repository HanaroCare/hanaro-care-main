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
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.repository.TBPensionSimulationRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.common.annotation.CheckUser;
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

	@CheckUser(key = "#userId")
	public PensionStatusResponse getStatus(Long userId) {
		PensionContext ctx = loadContext(userId);

		long totalMonths = calcTotalMonths(ctx.userProd().getStartDate());
		int elapsedYear = calcElapsedYear(totalMonths);

		// 1. 현재 시점의 누적액 및 수령액 계산 (Point 0)
		PensionPayoutYearlyDto floorEntry = floorEntry(ctx.yearlyData(), elapsedYear);
		BigDecimal currentMonthlyPayout = floorEntry.getMonthlyAmount();

		long extraMonths = Math.max(0, totalMonths - (long) (floorEntry.getYear() - 1) * 12);
		BigDecimal currentCumulativeAmount = calculateCumulativeAtMonth(ctx.yearlyData(), elapsedYear, extraMonths);

		// 2. 차트 포인트 재구성: [현재 시점] + [현재 이후의 미래 Sparse 포인트들]
		List<ChartPoint> chartPoints = new ArrayList<>();

		// 현재 시점 추가
		chartPoints.add(ChartPoint.builder()
			.year(elapsedYear)
			.monthlyAmount(currentMonthlyPayout)
			.cumulativeAmount(currentCumulativeAmount)
			.build());

		// 미래의 주요 변곡점(10년, 11년, 20년 등) 추가
		ctx.yearlyData().stream()
			.filter(d -> d.getYear() > elapsedYear)
			.map(d -> ChartPoint.builder()
				.year(d.getYear())
				.monthlyAmount(d.getMonthlyAmount())
				.cumulativeAmount(d.getCumulativeAmount())
				.build())
			.forEach(chartPoints::add);

		return PensionStatusResponse.builder()
			.pensionPayoutType(ctx.userProd().getPensionPayoutType().name())
			.pensionPayoutLabel(ctx.userProd().getPensionPayoutType().getDescription())
			.startDate(ctx.userProd().getStartDate())
			.elapsedYear(elapsedYear)
			.currentMonthlyPayout(currentMonthlyPayout)
			.currentCumulativeAmount(currentCumulativeAmount)
			.chartPoints(chartPoints)
			.build();
	}

	@CheckUser(key = "#userId")
	public PensionPayoutHistoryResponse getPayoutHistory(Long userId) {
		PensionContext ctx = loadContext(userId);

		LocalDate startDate = ctx.userProd().getStartDate();
		if (startDate == null || startDate.isAfter(LocalDate.now())) {
			return PensionPayoutHistoryResponse.builder()
				.totalReceivedAmount(BigDecimal.ZERO)
				.history(List.of())
				.build();
		}

		List<PayoutRecord> history = new ArrayList<>();
		BigDecimal total = BigDecimal.ZERO;
		LocalDate cursor = startDate;

		while (!cursor.isAfter(LocalDate.now())) {
			long monthsSinceStart = ChronoUnit.MONTHS.between(startDate, cursor);
			BigDecimal monthly = resolveMonthlyAmount(ctx.yearlyData(), calcElapsedYear(monthsSinceStart));
			total = total.add(monthly);
			history.add(PayoutRecord.builder().payoutDate(cursor).amount(monthly).build());
			cursor = cursor.plusMonths(1);
		}

		return PensionPayoutHistoryResponse.builder()
			.totalReceivedAmount(total)
			.history(history.stream()
				.sorted(Comparator.comparing(PayoutRecord::getPayoutDate).reversed())
				.toList())
			.build();
	}

	// ── 공통 컨텍스트 로드 ───────────────────────────────────────────────────────

	private record PensionContext(TBUserProd userProd, List<PensionPayoutYearlyDto> yearlyData) {}

	private PensionContext loadContext(Long userId) {
		TBUserProd userProd = userProdRepository
			.findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_NOT_SUBSCRIBED));

		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(userProd.getTargetAsset().getRealAssetId())
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

		List<PensionPayoutYearlyDto> yearlyData = deserializePlans(simulation.getPlansJson()).stream()
			.filter(p -> p.getType().equals(userProd.getPensionPayoutType().name()))
			.findFirst()
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND))
			.getYearlyData();

		return new PensionContext(userProd, yearlyData);
	}

	// ── 유틸 ────────────────────────────────────────────────────────────────────

	private long calcTotalMonths(LocalDate startDate) {
		if (startDate == null || startDate.isAfter(LocalDate.now())) return 0;
		return ChronoUnit.MONTHS.between(startDate, LocalDate.now());
	}

	private int calcElapsedYear(long totalMonths) {
		// 0개월~11개월 -> 1년차, 12개월~23개월 -> 2년차
		return (int) (totalMonths / 12) + 1;
	}

	private PensionPayoutYearlyDto floorEntry(List<PensionPayoutYearlyDto> yearlyData, int elapsedYear) {
		return yearlyData.stream()
			.filter(d -> d.getYear() <= elapsedYear)
			.max(Comparator.comparingInt(PensionPayoutYearlyDto::getYear))
			.orElse(yearlyData.get(0));
	}

	private BigDecimal resolveMonthlyAmount(List<PensionPayoutYearlyDto> yearlyData, int year) {
		return floorEntry(yearlyData, year).getMonthlyAmount();
	}

	/**
	 * 특정 경과 월수 시점의 정확한 누적 수령액 계산
	 * @param extraMonths 현재 연차 내에서 추가로 경과한 월 수
	 */
	private BigDecimal calculateCumulativeAtMonth(List<PensionPayoutYearlyDto> yearlyData, int elapsedYear, long extraMonths) {
		// 직전 연차까지의 누적액
		BigDecimal baseCumulative = BigDecimal.ZERO;
		if (elapsedYear > 1) {
			baseCumulative = yearlyData.stream()
				.filter(d -> d.getYear() < elapsedYear)
				.max(Comparator.comparingInt(PensionPayoutYearlyDto::getYear))
				.map(PensionPayoutYearlyDto::getCumulativeAmount)
				.orElse(BigDecimal.ZERO);
		}

		// 현재 연차의 월 수령액 * 추가 개월 수
		BigDecimal currentMonthly = resolveMonthlyAmount(yearlyData, elapsedYear);
		return baseCumulative.add(currentMonthly.multiply(BigDecimal.valueOf(extraMonths)));
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
