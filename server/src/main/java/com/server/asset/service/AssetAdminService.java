package com.server.asset.service;

import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.entity.TBAccount;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.PayoutType;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.mapper.TrustMapper;
import com.server.asset.repository.ProductRepository;
import com.server.asset.repository.TBAccountRepository;
import com.server.asset.repository.TBPensionSimulationRepository;
import com.server.asset.repository.TrustRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.TrustCalculator;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBUserRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AssetAdminService {

	private final TBUserRepository userRepository;
	private final TrustRepository trustRepository;
	private final UserProdRepository userProdRepository;
	private final ProductRepository productRepository;
	private final TrustMapper trustMapper;
	private final TBPensionSimulationRepository pensionSimulationRepository;
	private final TBAccountRepository accountRepository;

	@Transactional
	public Long subscribeTrustProduct(Long userId) {
		TBUser user = userRepository.findById(userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));

		TBTrustSimulation simulation = trustRepository.findByUser_UserId(userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

		TBProduct product = productRepository
			.findByProdCate(ProdCate.TRUST)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_FIXED_PRODUCT_NOT_FOUND));

		if (userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
			userId, ProdType.TRUST, ProdStat.IN_PROGRESS
		)) {
			throw new ApiException(ErrorStatus.TRUST_PRODUCT_ALREADY_EXISTS);
		}

		BigDecimal principal  = TrustCalculator.defaultIfNull(simulation.getPrincipalAmount());
		BigDecimal annualRate = TrustCalculator.resolveAnnualRate(simulation.getInvestType());
		SimulationDetailDto detail = TrustCalculator.calculateDetail(principal, annualRate);

		TBUserProd userProd = trustMapper.toUserProd(simulation, user, product, principal, detail);

		return userProdRepository.save(userProd).getUserProdId();
	}

	@Transactional
	public Long subscribePensionProduct(Long userId, Long realAssetId) {
		TBUser user = userRepository.findById(userId)
			.orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));

		TBPensionSimulation simulation = pensionSimulationRepository.findByRealAsset_RealAssetId(realAssetId)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

		if (!simulation.getRealAsset().getUser().getUserId().equals(userId)) {
			throw new ApiException(ErrorStatus._FORBIDDEN);
		}

		TBProduct product = productRepository.findByProdCate(ProdCate.PENSION)
			.orElseThrow(() -> new ApiException(ErrorStatus.PENSION_PRODUCT_NOT_FOUND));

		if (userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
			userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS
		)) {
			throw new ApiException(ErrorStatus.PENSION_ALREADY_EXISTS);
		}

		BigDecimal monthlyPayout = simulation.getRecommendedMonthlyAmt();

		TBUserProd userProd = TBUserProd.builder()
			.user(user)
			.product(product)
			.prodType(ProdType.HOUSING_PENSION)
			.payoutType(PayoutType.PENSION)
			.pensionPayoutType(simulation.getRecommendedType())
			.prodStat(ProdStat.IN_PROGRESS)
			.targetAsset(simulation.getRealAsset())
			.monthlyPayout(monthlyPayout)
			.build();

		TBUserProd savedProd = userProdRepository.save(userProd);

		TBAccount account = TBAccount.builder()
			.user(user)
			.instNm("한국주택금융공사")
			.accountNm("주택연금 (" + simulation.getRecommendedType().getDescription() + ")")
			.accountNum("HF-" + savedProd.getUserProdId())
			.balanceAmt(BigDecimal.ZERO)
			.assetCateCd(AssetCategory.PENSION)
			.profitRate(BigDecimal.ZERO)
			.payAmt(monthlyPayout)
			.monthlyPremAmt(BigDecimal.ZERO)
			.contrDt(userProd.getStartDate())
			.build();

		accountRepository.save(account);

		return savedProd.getUserProdId();
	}

	@Transactional
	public void enableAgentView(Long userId) {
		TBUserProd userProd = userProdRepository.findByUser_UserIdAndProduct_ProdCateAndProdStat(
			userId,
			ProdCate.TRUST,
			ProdStat.IN_PROGRESS
		).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

		if (userProd.getClaimAgent() == null) {
			throw new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND);
		}

		userProd.setIsAgentView(true);
	}
}
