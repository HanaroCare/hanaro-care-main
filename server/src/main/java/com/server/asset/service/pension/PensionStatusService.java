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
import com.server.asset.repository.PensionSimulationRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PensionStatusService {

	private static final int PENSION_PAYOUT_DAY = 25;

	private final UserProdRepository userProdRepository;
	private final PensionSimulationRepository pensionSimulationRepository;
	private final ObjectMapper objectMapper;

	@CheckUser(key = "#userId")
	public PensionStatusResponse getStatus(Long userId) {
		PensionContext ctx = loadContext(userId);

		LocalDate baseDate = resolveBaseDate(ctx.userProd());
		LocalDate firstPayoutDate = resolveFirstPayoutDate(baseDate);
		long paidMonths = calcPaidMonths(firstPayoutDate);

		int elapsedYear = calcElapsedYear(Math.max(0, paidMonths - 1));
		PensionPayoutYearlyDto floorEntry = floorEntry(ctx.yearlyData(), elapsedYear);
		BigDecimal currentMonthlyPayout = defaultIfNull(ctx.userProd().getMonthlyPayout());
		if (currentMonthlyPayout.compareTo(BigDecimal.ZERO) <= 0) {
			currentMonthlyPayout = floorEntry.getMonthlyAmount();
		}

		BigDecimal currentCumulativeAmount = defaultIfNull(ctx.userProd().getProfit());

		List<ChartPoint> chartPoints = new ArrayList<>();

		chartPoints.add(ChartPoint.builder()
			.year(elapsedYear)
			.monthlyAmount(currentMonthlyPayout)
			.cumulativeAmount(currentCumulativeAmount)
			.build());

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
			.createdAt(baseDate)
			.elapsedYear(elapsedYear)
			.currentMonthlyPayout(currentMonthlyPayout)
			.currentCumulativeAmount(currentCumulativeAmount)
			.chartPoints(chartPoints)
			.build();
	}

	@CheckUser(key = "#userId")
	public PensionPayoutHistoryResponse getPayoutHistory(Long userId) {
		PensionContext ctx = loadContext(userId);

		LocalDate baseDate = resolveBaseDate(ctx.userProd());
		LocalDate firstPayoutDate = resolveFirstPayoutDate(baseDate);

		LocalDate effectiveToday = ctx.userProd().getLastPayoutDate() != null
			? ctx.userProd().getLastPayoutDate()
			: LocalDate.now();

		if (firstPayoutDate == null || firstPayoutDate.isAfter(effectiveToday)) {
			return PensionPayoutHistoryResponse.builder()
				.totalReceivedAmount(BigDecimal.ZERO)
				.history(List.of())
				.build();
		}

		List<PayoutRecord> history = new ArrayList<>();
		BigDecimal total = BigDecimal.ZERO;
		LocalDate cursor = firstPayoutDate;

		while (!cursor.isAfter(effectiveToday)) {
			long monthsSinceStart = ChronoUnit.MONTHS.between(firstPayoutDate, cursor);
			int elapsedYear = calcElapsedYear(monthsSinceStart);
			BigDecimal monthly = resolveMonthlyAmount(ctx.yearlyData(), elapsedYear);

			total = total.add(monthly);

			history.add(PayoutRecord.builder()
				.payoutDate(cursor)
				.amount(monthly)
				.build());

			cursor = cursor.plusMonths(1);
			cursor = cursor.withDayOfMonth(
				Math.min(PENSION_PAYOUT_DAY, cursor.lengthOfMonth())
			);
		}

		return PensionPayoutHistoryResponse.builder()
			.totalReceivedAmount(total)
			.history(history.stream()
				.sorted(Comparator.comparing(PayoutRecord::getPayoutDate).reversed())
				.toList())
			.build();
	}

	private record PensionContext(TBUserProd userProd, List<PensionPayoutYearlyDto> yearlyData) {}

	private PensionContext loadContext(Long userId) {
		TBUserProd userProd = userProdRepository
			.findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(
				userId,
				ProdType.HOUSING_PENSION,
				ProdStat.IN_PROGRESS
			)
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

	private LocalDate resolveBaseDate(TBUserProd userProd) {
		if (userProd.getCreatedAt() != null) {
			return userProd.getCreatedAt().toLocalDate();
		}
		return userProd.getStartDate();
	}

	private long calcPaidMonths(LocalDate baseDate) {
		if (baseDate == null || baseDate.isAfter(LocalDate.now())) {
			return 0;
		}
		return ChronoUnit.MONTHS.between(baseDate, LocalDate.now()) + 1;
	}

	private int calcElapsedYear(long totalMonths) {
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

	private List<PensionPayoutPlanDto> deserializePlans(String plansJson) {
		try {
			return objectMapper.readValue(plansJson, new TypeReference<>() {});
		} catch (Exception e) {
			log.warn("플랜 JSON 역직렬화 실패", e);
			throw new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND);
		}
	}

	private LocalDate resolveFirstPayoutDate(LocalDate baseDate) {
		if (baseDate == null) {
			return null;
		}

		LocalDate payoutDate = baseDate.withDayOfMonth(
			Math.min(PENSION_PAYOUT_DAY, baseDate.lengthOfMonth())
		);

		if (baseDate.isAfter(payoutDate)) {
			LocalDate nextMonth = baseDate.plusMonths(1);
			return nextMonth.withDayOfMonth(
				Math.min(PENSION_PAYOUT_DAY, nextMonth.lengthOfMonth())
			);
		}

		return payoutDate;
	}

	private BigDecimal defaultIfNull(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}
}
