package com.server.asset.service;

import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.entity.enums.StartType;
import com.server.asset.mapper.PensionMapper;
import com.server.asset.mapper.TrustMapper;
import com.server.asset.repository.ProductRepository;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.PensionSimulationRepository;
import com.server.asset.repository.TrustRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.TrustCalculator;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetAdminService {

  private final UserRepository userRepository;
  private final TrustRepository trustRepository;
  private final UserProdRepository userProdRepository;
  private final ProductRepository productRepository;
  private final TrustMapper trustMapper;
  private final PensionMapper pensionMapper;
  private final PensionSimulationRepository pensionSimulationRepository;
  private final AccountRepository accountRepository;
  private final FamilyAuthRepository familyAuthRepository;

  @Transactional
  public Long subscribeTrustProduct(Long userId) {
    // 1. 유저 락 획득 (동시 가입 시도 직렬화)
    TBUser user = userRepository.findByIdWithLock(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));

    // 2. 가입 여부 체크
    if (userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
        userId, ProdType.TRUST, ProdStat.IN_PROGRESS
    )) {
      throw new ApiException(ErrorStatus.TRUST_PRODUCT_ALREADY_EXISTS);
    }

    TBTrustSimulation simulation = trustRepository.findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

    TBProduct product = productRepository
        .findByProdCate(ProdCate.TRUST)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_FIXED_PRODUCT_NOT_FOUND));

    BigDecimal principal = TrustCalculator.defaultIfNull(simulation.getPrincipalAmount());
    BigDecimal annualRate = TrustCalculator.resolveAnnualRate(simulation.getInvestType());
    SimulationDetailDto detail = TrustCalculator.calculateDetail(principal, annualRate);

    TBUserProd userProd = trustMapper.toUserProd(simulation, user, product, principal, detail);

    // 시작 타입에 따른 상태 처리
    if (simulation.getStartType() == StartType.CUSTOM) {
      userProd.setProdStat(ProdStat.PENDING);
    } else if (simulation.getStartType() == StartType.NOW) {
      userProd.setStartDate(LocalDate.now());
      userProd.setProdStat(ProdStat.IN_PROGRESS);
    }

    // 사후수익자(대리인) 처리
    TBUser claimAgent = simulation.getClaimAgent();
    if (claimAgent != null) {
      userProd.setIsAgentView(true);
      TBFamilyAuth familyAuth = familyAuthRepository
          .findByGrantor_UserIdAndGrantee_UserId(userId, claimAgent.getUserId())
          .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));
      familyAuth.setIsTrustView(true);
    }

    try {
      return userProdRepository.save(userProd).getUserProdId();
    } catch (DataIntegrityViolationException e) {
      log.warn("신탁 상품 중복 가입 시도 차단: userId={}", userId);
      throw new ApiException(ErrorStatus.TRUST_PRODUCT_ALREADY_EXISTS);
    }
  }


  @Transactional
  public Long subscribePensionProduct(Long userId, Long realAssetId) {
    // 1. 유저 락 획득
    TBUser user = userRepository.findByIdWithLock(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.PENSION_USER_NOT_FOUND));

    // 2. 중복 가입 체크
    if (userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
        userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS
    )) {
      throw new ApiException(ErrorStatus.PENSION_ALREADY_EXISTS);
    }

    TBPensionSimulation simulation = pensionSimulationRepository.findByRealAsset_RealAssetId(
            realAssetId)
        .orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

    if (!simulation.getRealAsset().getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

    TBProduct product = productRepository.findByProdCate(ProdCate.PENSION)
        .orElseThrow(() -> new ApiException(ErrorStatus.PENSION_PRODUCT_NOT_FOUND));

    try {
      TBUserProd savedProd = userProdRepository.save(
          pensionMapper.toUserProd(simulation, user, product)
      );

      accountRepository.save(
          pensionMapper.toPensionAccount(user, savedProd, simulation.getRecommendedMonthlyAmt(),
              simulation)
      );

      return savedProd.getUserProdId();
    } catch (DataIntegrityViolationException e) {
      log.warn("주택연금 중복 가입 시도 차단: userId={}, assetId={}", userId, realAssetId);
      throw new ApiException(ErrorStatus.PENSION_ALREADY_EXISTS);
    }
  }

  @Transactional
  public void enableAgentView(Long userId) {
    TBUserProd userProd = userProdRepository.findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
        userId,
        ProdCate.TRUST,
        ProdStat.IN_PROGRESS
    ).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

    TBUser claimAgent = userProd.getClaimAgent();
    if (claimAgent == null) {
      throw new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND);
    }

    userProd.setIsAgentView(true);

    TBFamilyAuth familyAuth = familyAuthRepository
        .findByGrantor_UserIdAndGrantee_UserId(userId, claimAgent.getUserId())
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));
    familyAuth.setIsTrustView(true);
  }
}
