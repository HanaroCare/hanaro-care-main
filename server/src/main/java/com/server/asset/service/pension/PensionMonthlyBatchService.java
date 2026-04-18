package com.server.asset.service.pension;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.pension.PensionPayoutPlanDto;
import com.server.asset.dto.pension.PensionPayoutYearlyDto;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.PensionSimulationRepository;
import com.server.asset.repository.UserProdRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PensionMonthlyBatchService {

	private static final int PENSION_PAYOUT_DAY = 25;

	private final UserProdRepository userProdRepository;
	private final PensionSimulationRepository pensionSimulationRepository;
	private final AccountRepository accountRepository;
	private final ObjectMapper objectMapper;

	private static final List<AssetCategory> PENSION_CATEGORIES = List.of(
		AssetCategory.PENSION,
		AssetCategory.PENSION_NATIONAL,
		AssetCategory.PENSION_RETIRE,
		AssetCategory.PENSION_PERSONAL
	);

	@Transactional
	public void creditDailyPensionPayout(LocalDate today) {
		int payDay = today.getDayOfMonth();
		boolean isLastDayOfMonth = (payDay == today.lengthOfMonth());
		// 월말이면 이번 달에 존재하지 않는 날짜(예: 2월의 29~31일)도 함께 정산
		int maxDay = isLastDayOfMonth ? 31 : payDay;

		List<TBAccount> accounts = accountRepository.findPensionAccountsForPayout(
			PENSION_CATEGORIES, payDay, maxDay);

		for (TBAccount account : accounts) {
			BigDecimal newBalance = account.getBalanceAmt().add(account.getPayAmt());
			account.setBalanceAmt(newBalance);
			log.info("Pension payout credited. accountId={}, userId={}, payDay={}, payAmt={}, newBalance={}",
				account.getAccountId(), account.getUser().getUserId(),
				account.getPayDay(), account.getPayAmt(), newBalance);
		}
	}

	@Transactional
	public void settleMonthlyPayout(LocalDate today) {
		if (today.getDayOfMonth() != PENSION_PAYOUT_DAY) {
			return;
		}

		List<TBUserProd> products = userProdRepository.findAllByProdTypeAndProdStat(
			ProdType.HOUSING_PENSION,
			ProdStat.IN_PROGRESS
		);

		for (TBUserProd userProd : products) {
			BigDecimal monthlyPayout = resolveCurrentMonthlyPayout(userProd, today);

			if (monthlyPayout.compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			BigDecimal currentCumulativeAmount = defaultIfNull(userProd.getProfit());
			BigDecimal newCumulativeAmount = currentCumulativeAmount.add(monthlyPayout);

			userProd.setMonthlyPayout(monthlyPayout);
			userProd.setProfit(newCumulativeAmount);

			log.info(
				"Pension monthly payout settled. userProdId={}, userId={}, ym={}, monthlyPayout={}, cumulativeAmount={}",
				userProd.getUserProdId(),
				userProd.getUser().getUserId(),
				YearMonth.from(today),
				monthlyPayout,
				newCumulativeAmount
			);
		}
	}

	private BigDecimal resolveCurrentMonthlyPayout(TBUserProd userProd, LocalDate today) {
		if (userProd.getTargetAsset() == null || userProd.getPensionPayoutType() == null) {
			return BigDecimal.ZERO;
		}

		TBPensionSimulation simulation = pensionSimulationRepository
			.findByRealAsset_RealAssetId(userProd.getTargetAsset().getRealAssetId())
			.orElse(null);

		if (simulation == null || simulation.getPlansJson() == null || simulation.getPlansJson().isBlank()) {
			return BigDecimal.ZERO;
		}

		List<PensionPayoutPlanDto> plans = deserializePlans(simulation.getPlansJson());

		List<PensionPayoutYearlyDto> yearlyData = plans.stream()
			.filter(p -> p.getType().equals(userProd.getPensionPayoutType().name()))
			.findFirst()
			.map(PensionPayoutPlanDto::getYearlyData)
			.orElse(List.of());

		if (yearlyData.isEmpty()) {
			return BigDecimal.ZERO;
		}

		LocalDate baseDate = resolveBaseDate(userProd);
		LocalDate firstPayoutDate = resolveFirstPayoutDate(baseDate);

		if (firstPayoutDate == null || firstPayoutDate.isAfter(today)) {
			return BigDecimal.ZERO;
		}

		long paidMonths = ChronoUnit.MONTHS.between(firstPayoutDate, today) + 1;
		int elapsedYear = (int) ((Math.max(0, paidMonths - 1)) / 12) + 1;

		return floorEntry(yearlyData, elapsedYear).getMonthlyAmount();
	}

	private List<PensionPayoutPlanDto> deserializePlans(String plansJson) {
		try {
			return objectMapper.readValue(plansJson, new TypeReference<>() {});
		} catch (Exception e) {
			return List.of();
		}
	}

	private LocalDate resolveBaseDate(TBUserProd userProd) {
		if (userProd.getCreatedAt() != null) {
			return userProd.getCreatedAt().toLocalDate();
		}
		return userProd.getStartDate();
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

	private PensionPayoutYearlyDto floorEntry(List<PensionPayoutYearlyDto> yearlyData, int elapsedYear) {
		return yearlyData.stream()
			.filter(d -> d.getYear() <= elapsedYear)
			.max(Comparator.comparingInt(PensionPayoutYearlyDto::getYear))
			.orElse(yearlyData.get(0));
	}

	private BigDecimal defaultIfNull(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}
}
