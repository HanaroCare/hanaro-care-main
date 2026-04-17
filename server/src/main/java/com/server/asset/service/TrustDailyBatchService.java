package com.server.asset.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.trust.TrustPayoutSettingsDto;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.InvestType;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.entity.enums.TrustType;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.TrustCalculator;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrustDailyBatchService {

	private final UserProdRepository userProdRepository;
	private final ObjectMapper objectMapper;

	@Transactional
	public void settleDailyProfit(LocalDate today) {
		List<TBUserProd> products = userProdRepository.findAllByProdTypeAndProdStat(
			ProdType.TRUST,
			ProdStat.IN_PROGRESS
		);

		for (TBUserProd userProd : products) {
			BigDecimal principalAmount = defaultIfNull(userProd.getPrincipalAmount());
			BigDecimal accumulatedProfit = defaultIfNull(userProd.getProfit());
			BigDecimal executionAmount = calculateExecutionAmount(userProd, today);

			BigDecimal baseAmount = principalAmount
				.add(accumulatedProfit)
				.subtract(executionAmount);

			if (baseAmount.compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			BigDecimal dailyRate = resolveDailyRate(userProd, today);
			BigDecimal todayProfit = baseAmount.multiply(dailyRate).setScale(0, RoundingMode.DOWN);

			BigDecimal newProfit = accumulatedProfit.add(todayProfit);
			BigDecimal newProfitRate = BigDecimal.ZERO;

			if (principalAmount.compareTo(BigDecimal.ZERO) > 0) {
				newProfitRate = newProfit
					.divide(principalAmount, 4, RoundingMode.DOWN)
					.multiply(BigDecimal.valueOf(100))
					.setScale(1, RoundingMode.DOWN);
			}

			userProd.setProfit(newProfit);
			userProd.setProfitRate(newProfitRate);

			log.info(
				"Trust daily profit settled. userProdId={}, userId={}, date={}, investType={}, dailyRate={}, todayProfit={}, totalProfit={}",
				userProd.getUserProdId(),
				userProd.getUser().getUserId(),
				today,
				userProd.getInvestType(),
				dailyRate,
				todayProfit,
				newProfit
			);
		}
	}

	private BigDecimal calculateExecutionAmount(TBUserProd userProd, LocalDate today) {
		TrustPayoutSettingsDto payoutSettings = parsePayoutSettings(userProd.getPayoutSettings());

		BigDecimal hospitalAmount = BigDecimal.ZERO;
		BigDecimal livingAmount = BigDecimal.ZERO;

		if (payoutSettings.items() != null) {
			for (TrustPayoutSettingsDto.PayoutItemDto item : payoutSettings.items()) {
				if (item.type() == TrustType.HOSPITAL) {
					hospitalAmount = TrustCalculator.defaultIfNull(item.amount());
				}
				if (item.type() == TrustType.LIVING) {
					livingAmount = TrustCalculator.defaultIfNull(item.amount());
				}
			}
		}

		BigDecimal monthlyTotal = TrustCalculator.calculateMonthlyTotal(hospitalAmount, livingAmount);

		LocalDate startDate = userProd.getCreatedAt() != null
			? userProd.getCreatedAt().toLocalDate()
			: userProd.getStartDate();

		if (startDate == null || startDate.isAfter(today)) {
			return BigDecimal.ZERO;
		}

		long monthsPassed = ChronoUnit.MONTHS.between(
			java.time.YearMonth.from(startDate),
			java.time.YearMonth.from(today)
		) + 1;

		return TrustCalculator.calculateTotalExecution(monthlyTotal, Math.max(monthsPassed, 0));
	}

	private BigDecimal resolveDailyRate(TBUserProd userProd, LocalDate today) {
		long seed = Objects.hash(userProd.getUserProdId(), today.toString());
		Random random = new Random(seed);

		if (userProd.getInvestType() == InvestType.LUMP_SUM) {
			double min = 0.0001;
			double max = 0.0005;
			return BigDecimal.valueOf(min + (max - min) * random.nextDouble());
		}

		double min = -0.0008;
		double max = 0.0012;
		return BigDecimal.valueOf(min + (max - min) * random.nextDouble());
	}

	private TrustPayoutSettingsDto parsePayoutSettings(String json) {
		try {
			if (json == null || json.isBlank()) {
				return new TrustPayoutSettingsDto(List.of());
			}
			return objectMapper.readValue(json, TrustPayoutSettingsDto.class);
		} catch (Exception e) {
			return new TrustPayoutSettingsDto(List.of());
		}
	}

	private BigDecimal defaultIfNull(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}
}
