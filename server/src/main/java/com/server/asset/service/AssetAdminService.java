package com.server.asset.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.server.asset.dto.admin.AdminChildFamilyResponse;
import com.server.asset.dto.admin.AdminRealAssetResponse;
import com.server.asset.dto.admin.AdminUserDetailResponse;
import com.server.asset.dto.admin.AdminUserSearchResponse;
import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.entity.TBPensionSimulation;
import com.server.asset.entity.TBProduct;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.entity.enums.StartType;
import com.server.user.enums.FamilyRelation;
import com.server.asset.mapper.PensionMapper;
import com.server.asset.mapper.TrustMapper;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.PensionSimulationRepository;
import com.server.asset.repository.ProductRepository;
import com.server.asset.repository.RealAssetRepository;
import com.server.asset.repository.TrustRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.TrustCalculator;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetAdminService {

  private final UserRepository userRepository;
  private final TrustRepository trustRepository;
  private final SimulationRefreshService simulationRefreshService;
  private final SimulationAsyncService simulationAsyncService;
  private final UserProdRepository userProdRepository;
  private final ProductRepository productRepository;
  private final TrustMapper trustMapper;
  private final PensionMapper pensionMapper;
  private final PensionSimulationRepository pensionSimulationRepository;
  private final AccountRepository accountRepository;
  private final FamilyAuthRepository familyAuthRepository;
  private final RealAssetRepository realAssetRepository;

  @Transactional(readOnly = true)
  public List<AdminUserSearchResponse> searchUsers(String keyword) {
    String trimmed = keyword == null ? "" : keyword.trim();
    if (trimmed.isBlank()) {
      return List.of();
    }

    return userRepository.searchAdminUsers(trimmed).stream()
        .map(AdminUserSearchResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public AdminUserDetailResponse getUserDetail(Long userId) {
    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));
    return AdminUserDetailResponse.from(user);
  }

  @Transactional(readOnly = true)
  public List<AdminChildFamilyResponse> getChildFamilyMembers(Long userId) {
    userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));
    return familyAuthRepository.findAllByGrantor_UserIdAndRelationCd(userId, FamilyRelation.CHILD)
        .stream()
        .map(auth -> AdminChildFamilyResponse.from(auth.getGrantee()))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<AdminRealAssetResponse> getUserRealAssets(Long userId) {
    userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));

    return realAssetRepository.findAllByUser_UserIdAndAssetCateCd(userId, RealAssetCategory.REAL_ESTATE)
        .stream()
        .map(AdminRealAssetResponse::from)
        .toList();
  }

  @Transactional
  public Long subscribeTrustProduct(Long userId) {
    TBUser user = userRepository.findByIdWithLock(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));

    if (userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
        userId, ProdType.TRUST, ProdStat.IN_PROGRESS
    )) {
      throw new ApiException(ErrorStatus.TRUST_PRODUCT_ALREADY_EXISTS);
    }

    TBTrustSimulation simulation = trustRepository.findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

    TBProduct product = productRepository
        .findFirstByProdCate(ProdCate.TRUST)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_FIXED_PRODUCT_NOT_FOUND));

    BigDecimal principal = TrustCalculator.defaultIfNull(simulation.getPrincipalAmount());
    BigDecimal annualRate = TrustCalculator.resolveAnnualRate(simulation.getInvestType());
    SimulationDetailDto detail = TrustCalculator.calculateDetail(principal, annualRate);

    TBUserProd userProd = trustMapper.toUserProd(simulation, user, product, principal, detail);

    if (simulation.getStartType() == StartType.CUSTOM) {
      userProd.setProdStat(ProdStat.PENDING);
    } else if (simulation.getStartType() == StartType.NOW) {
      userProd.setStartDate(LocalDate.now());
      userProd.setProdStat(ProdStat.IN_PROGRESS);
    }

    TBUser claimAgent = simulation.getClaimAgent();
    if (claimAgent != null) {
      userProd.setClaimAgent(claimAgent);
      userProd.setIsAgentView(true);
      TBFamilyAuth familyAuth = familyAuthRepository
          .findFirstByGrantor_UserIdAndGrantee_UserIdOrderByFamilyAuthIdDesc(userId, claimAgent.getUserId())
          .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));
      familyAuth.setIsTrustView(true);
    }

    try {
      Long userProdId = userProdRepository.save(userProd).getUserProdId();
      simulationRefreshService.enqueue(userId);
      return userProdId;
    } catch (DataIntegrityViolationException e) {
      log.warn("신탁 상품 중복 가입 시도 차단: userId={}", userId);
      throw new ApiException(ErrorStatus.TRUST_PRODUCT_ALREADY_EXISTS);
    }
  }

  @Transactional
  public Long subscribePensionProduct(Long userId, Long realAssetId) {
    TBUser user = userRepository.findByIdWithLock(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.PENSION_USER_NOT_FOUND));

    if (userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
        userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS
    )) {
      throw new ApiException(ErrorStatus.PENSION_ALREADY_EXISTS);
    }

    TBPensionSimulation simulation = pensionSimulationRepository.findByRealAsset_RealAssetId(realAssetId)
        .orElseThrow(() -> new ApiException(ErrorStatus.PENSION_SIMULATION_NOT_FOUND));

    if (!simulation.getRealAsset().getUser().getUserId().equals(userId)) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

    TBProduct product = productRepository.findFirstByProdCate(ProdCate.PENSION)
        .orElseThrow(() -> new ApiException(ErrorStatus.PENSION_PRODUCT_NOT_FOUND));

    try {
      TBUserProd savedProd = userProdRepository.save(
          pensionMapper.toUserProd(simulation, user, product)
      );

      accountRepository.save(
          pensionMapper.toPensionAccount(user, savedProd, simulation.getRecommendedMonthlyAmt(), simulation)
      );

      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
        @Override
        public void afterCommit() {
          simulationAsyncService.rerunAfterAssetChange(userId);
          log.info("[주택연금 가입] 커밋 후 비동기 시뮬레이션 재실행 요청: userId={}", userId);
        }
      });

      return savedProd.getUserProdId();
    } catch (DataIntegrityViolationException e) {
      log.warn("주택연금 중복 가입 시도 차단: userId={}, assetId={}", userId, realAssetId);
      throw new ApiException(ErrorStatus.PENSION_ALREADY_EXISTS);
    }
  }

  @Transactional
  public void updateClaimAgent(Long userId, Long agentUserId) {
    TBUserProd userProd = userProdRepository.findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(
        userId,
        ProdType.TRUST,
        ProdStat.IN_PROGRESS
    ).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

    TBUser agentUser = userRepository.findById(agentUserId)
        .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));

    TBFamilyAuth familyAuth = familyAuthRepository
        .findFirstByGrantor_UserIdAndGrantee_UserIdOrderByFamilyAuthIdDesc(userId, agentUserId)
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

    if (familyAuth.getRelationCd() != FamilyRelation.CHILD) {
      throw new ApiException(ErrorStatus._FORBIDDEN);
    }

    TBUser prevAgent = userProd.getClaimAgent();
    if (prevAgent != null && !prevAgent.getUserId().equals(agentUserId)) {
      familyAuthRepository.findFirstByGrantor_UserIdAndGrantee_UserIdOrderByFamilyAuthIdDesc(userId, prevAgent.getUserId())
          .ifPresent(prev -> {
            prev.setIsTrustView(false);
            prev.setIsProxyClaim(false);
          });
    }

    userProd.setClaimAgent(agentUser);
    userProd.setIsAgentView(true);
    familyAuth.setIsProxyClaim(true);
    familyAuth.setIsTrustView(true);
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
        .findFirstByGrantor_UserIdAndGrantee_UserIdOrderByFamilyAuthIdDesc(userId, claimAgent.getUserId())
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));
    familyAuth.setIsTrustView(true);
  }
}
