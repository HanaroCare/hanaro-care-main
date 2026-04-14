package com.server.asset.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.trust.*;
import com.server.asset.dto.trust.TrustSimulationResultResponse.AmountResultDto;
import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.StartType;
import com.server.asset.entity.enums.TrustAccessLevel;
import com.server.asset.entity.enums.TrustType;
import com.server.asset.mapper.TrustMapper;
import com.server.asset.repository.TrustRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.TrustCalculator;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBFamilyAuthRepository;
import com.server.user.repository.TBUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class TrustService {

	private static final List<BigDecimal> CHART_AMOUNTS = List.of(
		new BigDecimal("10000000"), new BigDecimal("30000000"), new BigDecimal("50000000"),
		new BigDecimal("100000000"), new BigDecimal("150000000"), new BigDecimal("200000000")
	);

	private static final List<String> CHART_LABELS = List.of("1천만", "3천만", "5천만", "1억", "1.5억", "2억");

	private final TrustRepository trustRepository;
	private final UserProdRepository userProdRepository;
	private final TBUserRepository userRepository;
	private final TBFamilyAuthRepository familyAuthRepository;
	private final TrustMapper trustMapper;
	private final ObjectMapper objectMapper;

	@Transactional
	public void saveSimulation(Long userId, TrustSimulationSaveRequest request) {
		TBUser user = userRepository.findById(userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));

		if (request.startType() == StartType.CUSTOM && request.startDate() == null) {
			throw new ApiException(ErrorStatus.TRUST_START_DATE_REQUIRED);
		}

		TBUser claimAgent = null;
		if (request.claimAgentId() != null) {
			claimAgent = userRepository.findById(request.claimAgentId())
				.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND));
		}

		TBTrustSimulation simulation = trustRepository
			.findByUser_UserId(userId)
			.orElse(TBTrustSimulation.builder().user(user).build());

		trustMapper.updateSimulation(request, claimAgent, simulation);
		trustRepository.save(simulation);
	}

	@Transactional(readOnly = true)
	public TrustSimulationResultResponse getSimulationResult(Long userId) {
		TBTrustSimulation simulation = trustRepository
			.findByUser_UserId(userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

		BigDecimal annualRate = TrustCalculator.resolveAnnualRate(simulation.getInvestType());
		BigDecimal userPrincipal = simulation.getPrincipalAmount();

		SimulationDetailDto selectedDetail = TrustCalculator.calculateDetail(userPrincipal, annualRate);

		List<AmountResultDto> amountResults = IntStream.range(0, CHART_AMOUNTS.size())
			.mapToObj(i -> {
				BigDecimal chartPrincipal = CHART_AMOUNTS.get(i);
				SimulationDetailDto detail = TrustCalculator.calculateDetail(chartPrincipal, annualRate);
				return new AmountResultDto(
					CHART_LABELS.get(i),
					detail.principalAmount(),
					detail.expectedProfit(),
					detail.tax(),
					detail.expectedNetAmount(),
					detail.profitRate(),
					chartPrincipal.compareTo(userPrincipal) == 0
				);
			})
			.toList();

		return new TrustSimulationResultResponse(selectedDetail, amountResults);
	}

	@Transactional(readOnly = true)
	public SimulationDetailDto getSimulationSummary(Long userId) {
		TBTrustSimulation simulation = trustRepository
			.findByUser_UserId(userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

		return TrustCalculator.calculateDetail(
			simulation.getPrincipalAmount(),
			TrustCalculator.resolveAnnualRate(simulation.getInvestType())
		);
	}

	@Transactional(readOnly = true)
	public TrustProductResponse getProductSummary(Long userId, Long userProdId) {
		TBUserProd userProd = userProdRepository.findById(userProdId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

		validateOwner(userId, userProd);
		return convertToProductResponse(userProd);
	}

	@Transactional(readOnly = true)
	public TrustProductResponse getFamilyTrustDetail(Long granteeUserId, Long grantorUserId) {
		validateTrustAccess(granteeUserId, grantorUserId);

		TBUserProd userProd = userProdRepository.findByUser_UserIdAndProduct_ProdCateAndProdStat(
			grantorUserId,
			ProdCate.TRUST,
			ProdStat.IN_PROGRESS
		).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

		return convertToProductResponse(userProd);
	}

	@Transactional(readOnly = true)
	public TrustAccessResponse getTrustAccess(Long granteeUserId, Long grantorUserId) {
		TBFamilyAuth familyAuth = familyAuthRepository
			.findByGrantor_UserIdAndGrantee_UserId(grantorUserId, granteeUserId)
			.orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

		boolean canView = Boolean.TRUE.equals(familyAuth.getIsTrustView());
		boolean isProxy = Boolean.TRUE.equals(familyAuth.getIsProxyClaim());

		TrustAccessLevel accessLevel;
		if (isProxy && canView) {
			accessLevel = TrustAccessLevel.READ_WRITE;
		} else if (isProxy) {
			accessLevel = TrustAccessLevel.PROXY_ONLY;
		} else {
			accessLevel = TrustAccessLevel.NONE;
		}

		return new TrustAccessResponse(
			grantorUserId,
			granteeUserId,
			accessLevel
		);
	}

	@Transactional(readOnly = true)
	public void validateTrustAccess(Long granteeUserId, Long grantorUserId) {
		TBFamilyAuth familyAuth = familyAuthRepository
			.findByGrantor_UserIdAndGrantee_UserId(grantorUserId, granteeUserId)
			.orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

		if (!Boolean.TRUE.equals(familyAuth.getIsTrustView())) {
			throw new ApiException(ErrorStatus.TRUST_VIEW_FORBIDDEN);
		}
	}

	@Transactional
	public void updatePayoutSettings(Long userId, Long userProdId, TrustPayoutSettingsUpdateRequest request) {
		TBUserProd userProd = userProdRepository.findById(userProdId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));
		validateOwner(userId, userProd);

		try {
			userProd.setPayoutSettings(objectMapper.writeValueAsString(request));
		} catch (Exception e) {
			throw new ApiException(ErrorStatus.TRUST_INVALID_PAYOUT_SETTINGS);
		}
	}

	@Transactional
	public void updateAgentView(Long userId, Long userProdId, TrustAgentViewUpdateRequest request) {
		TBUserProd userProd = userProdRepository.findById(userProdId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));
		validateOwner(userId, userProd);

		if (userProd.getClaimAgent() == null) {
			throw new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND);
		}
		userProd.setIsAgentView(Boolean.TRUE.equals(request.agentViewEnabled()));
	}

	private TrustProductResponse convertToProductResponse(TBUserProd userProd) {
		BigDecimal principalAmount = TrustCalculator.defaultIfNull(userProd.getPrincipalAmount());
		BigDecimal profit          = TrustCalculator.defaultIfNull(userProd.getProfit());
		BigDecimal profitRate      = TrustCalculator.defaultIfNull(userProd.getProfitRate());
		BigDecimal currentAmount   = TrustCalculator.calculateCurrentAmount(principalAmount, profit);

		TrustSimulationSaveRequest.PayoutSettingsDto payoutSettings = parsePayoutSettings(userProd.getPayoutSettings());
		TrustProductResponse.ExecutionSetting executionSetting = mapExecutionSetting(payoutSettings.items());

		BigDecimal monthlyTotal = TrustCalculator.calculateMonthlyTotal(
			executionSetting.hospitalAmount(), executionSetting.livingAmount()
		);
		long monthsPassed = TrustCalculator.calculateMonthsPassed(userProd.getCreatedAt().toLocalDate());
		BigDecimal executionAmount = TrustCalculator.calculateTotalExecution(monthlyTotal, monthsPassed);

		return trustMapper.toProductResponse(
			userProd, currentAmount, profitRate, principalAmount, executionAmount, profit, executionSetting
		);
	}

	private TrustSimulationSaveRequest.PayoutSettingsDto parsePayoutSettings(String json) {
		try {
			if (json == null || json.isBlank()) return new TrustSimulationSaveRequest.PayoutSettingsDto(List.of());
			return objectMapper.readValue(json, TrustSimulationSaveRequest.PayoutSettingsDto.class);
		} catch (Exception e) {
			return new TrustSimulationSaveRequest.PayoutSettingsDto(List.of());
		}
	}

	private TrustProductResponse.ExecutionSetting mapExecutionSetting(List<TrustSimulationSaveRequest.PayoutSettingsDto.PayoutItemDto> items) {
		boolean hEnabled = false; BigDecimal hAmount = BigDecimal.ZERO;
		boolean lEnabled = false; BigDecimal lAmount = BigDecimal.ZERO;

		if (items != null) {
			for (var item : items) {
				if (item.type() == TrustType.HOSPITAL) { hEnabled = true; hAmount = TrustCalculator.defaultIfNull(item.amount()); }
				if (item.type() == TrustType.LIVING) { lEnabled = true; lAmount = TrustCalculator.defaultIfNull(item.amount()); }
			}
		}
		return new TrustProductResponse.ExecutionSetting(hEnabled, hAmount, lEnabled, lAmount);
	}

	private void validateOwner(Long userId, TBUserProd userProd) {
		if (!userProd.getUser().getUserId().equals(userId)) throw new ApiException(ErrorStatus._FORBIDDEN);
	}
}
