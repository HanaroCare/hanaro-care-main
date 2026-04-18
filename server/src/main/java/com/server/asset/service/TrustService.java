package com.server.asset.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.trust.TrustAgentViewUpdateRequest;
import com.server.asset.dto.trust.TrustGrantorResponse;
import com.server.asset.dto.trust.TrustPayoutSettingsDto;
import com.server.asset.dto.trust.TrustPayoutSettingsUpdateRequest;
import com.server.asset.dto.trust.TrustProductResponse;
import com.server.asset.dto.trust.TrustSimulationResultResponse;
import com.server.asset.dto.trust.TrustSimulationResultResponse.AmountResultDto;
import com.server.asset.dto.trust.TrustSimulationResultResponse.SimulationDetailDto;
import com.server.asset.dto.trust.TrustSimulationSaveRequest;
import com.server.asset.entity.TBTrustSimulation;
import com.server.asset.entity.TBUserProd;
import com.server.asset.entity.enums.ProdCate;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.StartType;
import com.server.asset.entity.enums.TrustAccessLevel;
import com.server.asset.entity.enums.TrustType;
import com.server.asset.mapper.TrustMapper;
import com.server.asset.mapper.TrustMapperHelper;
import com.server.asset.repository.TrustRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.asset.util.TrustCalculator;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrustService {

  private static final List<BigDecimal> CHART_AMOUNTS = List.of(
      new BigDecimal("10000000"),
      new BigDecimal("30000000"),
      new BigDecimal("50000000"),
      new BigDecimal("100000000"),
      new BigDecimal("150000000"),
      new BigDecimal("200000000")
  );

  private static final List<String> CHART_LABELS = List.of(
      "1천만", "3천만", "5천만", "1억", "1.5억", "2억"
  );

  private final TrustRepository trustRepository;
  private final UserProdRepository userProdRepository;
  private final UserRepository userRepository;
  private final FamilyAuthRepository familyAuthRepository;
  private final TrustMapper trustMapper;
  private final ObjectMapper objectMapper;
  private final TrustMapperHelper trustMapperHelper;

  @CheckUser(key = "#userId")
  @Transactional
  public void saveSimulation(Long userId, TrustSimulationSaveRequest request) {
    TBUser user = getUser(userId);
    validateSimulationRequest(request);

    TBUser claimAgent = getClaimAgent(request.claimAgentId());

    TBTrustSimulation simulation = trustRepository.findByUser_UserId(userId)
        .orElse(TBTrustSimulation.builder().user(user).build());

    trustMapper.updateSimulation(request, claimAgent, simulation, trustMapperHelper);

    if (claimAgent != null) {
      TBFamilyAuth familyAuth = familyAuthRepository
          .findByGrantor_UserIdAndGrantee_UserId(userId, claimAgent.getUserId())
          .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

      familyAuth.setIsProxyClaim(true);
      familyAuth.setIsTrustView(true);
    }

    trustRepository.save(simulation);
  }

  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public SimulationDetailDto getSimulationSummary(Long userId) {
    TBTrustSimulation simulation = getSimulation(userId);

    return TrustCalculator.calculateDetail(
        TrustCalculator.defaultIfNull(simulation.getPrincipalAmount()),
        TrustCalculator.resolveAnnualRate(simulation.getInvestType())
    );
  }

  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public TrustSimulationResultResponse getSimulationDetail(Long userId) {
    TBTrustSimulation simulation = getSimulation(userId);

    BigDecimal annualRate = TrustCalculator.resolveAnnualRate(simulation.getInvestType());
    BigDecimal userPrincipal = TrustCalculator.defaultIfNull(simulation.getPrincipalAmount());

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

  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public TrustProductResponse getProduct(Long userId) {
    TBUserProd userProd = getInProgressTrustProduct(userId);
    return toProductResponse(userProd);
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustGrantorResponse getFamilyGrantors(Long granteeId) {
    List<TrustGrantorResponse.GrantorItem> items = familyAuthRepository
        .findAllByGrantee_UserId(granteeId)
        .stream()
        .map(auth -> new TrustGrantorResponse.GrantorItem(
            String.valueOf(auth.getGrantor().getUserId()),
            auth.getGrantor().getUserNm(),
            auth.getRelationCd().name(),
            auth.getRelationCd().getDescription(),
            resolveAccessLevel(auth)
        ))
        .toList();

    return new TrustGrantorResponse(items);
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public SimulationDetailDto getFamilySimulationSummary(Long granteeId, Long grantorId) {
    validateTrustViewAccess(granteeId, grantorId);

    TBTrustSimulation simulation = getSimulation(grantorId);

    return TrustCalculator.calculateDetail(
        TrustCalculator.defaultIfNull(simulation.getPrincipalAmount()),
        TrustCalculator.resolveAnnualRate(simulation.getInvestType())
    );
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustProductResponse getFamilyProduct(Long granteeId, Long grantorId) {
    validateTrustViewAccess(granteeId, grantorId);
    TBUserProd userProd = getInProgressTrustProduct(grantorId);
    return toProductResponse(userProd);
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public void validateTrustViewAccess(Long granteeId, Long grantorId) {
    TBFamilyAuth familyAuth = familyAuthRepository
        .findByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId)
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

    if (!Boolean.TRUE.equals(familyAuth.getIsTrustView())) {
      throw new ApiException(ErrorStatus.TRUST_VIEW_FORBIDDEN);
    }
  }

  @CheckUser(key = "#userId")
  @Transactional
  public void updatePayoutSettings(Long userId, TrustPayoutSettingsUpdateRequest request) {
    TBUserProd userProd = getInProgressTrustProduct(userId);

    try {
      userProd.setPayoutSettings(objectMapper.writeValueAsString(request.payoutSettings()));
    } catch (Exception e) {
      throw new ApiException(ErrorStatus.TRUST_INVALID_PAYOUT_SETTINGS);
    }
  }

  @CheckUser(key = "#userId")
  @Transactional
  public void updateAgentView(Long userId, TrustAgentViewUpdateRequest request) {
    TBUserProd userProd = getInProgressTrustProduct(userId);

    TBUser claimAgent = userProd.getClaimAgent();
    if (claimAgent == null) {
      throw new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND);
    }

    boolean enabled = Boolean.TRUE.equals(request.agentViewEnabled());
    userProd.setIsAgentView(enabled);

    TBFamilyAuth familyAuth = familyAuthRepository
        .findByGrantor_UserIdAndGrantee_UserId(userId, claimAgent.getUserId())
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

    familyAuth.setIsTrustView(enabled);
  }

  private void validateSimulationRequest(TrustSimulationSaveRequest request) {
    if (request.startType() == StartType.CUSTOM && request.startDate() == null) {
      throw new ApiException(ErrorStatus.TRUST_START_DATE_REQUIRED);
    }
  }

  private TrustAccessLevel resolveAccessLevel(TBFamilyAuth auth) {
    boolean canView = Boolean.TRUE.equals(auth.getIsTrustView());
    boolean isProxy = Boolean.TRUE.equals(auth.getIsProxyClaim());

    if (isProxy && canView) {
      return TrustAccessLevel.READ_WRITE;
    }
    if (isProxy) {
      return TrustAccessLevel.PROXY_ONLY;
    }
    return TrustAccessLevel.NONE;
  }

  private TBUser getUser(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));
  }

  private TBUser getClaimAgent(Long claimAgentId) {
    if (claimAgentId == null) {
      return null;
    }
    return userRepository.findById(claimAgentId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND));
  }

  private TBTrustSimulation getSimulation(Long userId) {
    return trustRepository.findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));
  }

  private TBUserProd getInProgressTrustProduct(Long userId) {
    return userProdRepository
        .findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
            userId,
            ProdCate.TRUST,
            ProdStat.IN_PROGRESS
        )
        .orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));
  }

  private TrustProductResponse toProductResponse(TBUserProd userProd) {
    BigDecimal principalAmount = TrustCalculator.defaultIfNull(userProd.getPrincipalAmount());
    BigDecimal profit = TrustCalculator.defaultIfNull(userProd.getProfit());
    BigDecimal profitRate = TrustCalculator.defaultIfNull(userProd.getProfitRate());

    TrustPayoutSettingsDto payoutSettings = parsePayoutSettings(userProd.getPayoutSettings());

    TrustProductResponse.ExecutionSetting executionSetting =
        mapExecutionSetting(payoutSettings.items());

    BigDecimal monthlyTotal = TrustCalculator.calculateMonthlyTotal(
        executionSetting.hospitalAmount(),
        executionSetting.livingAmount()
    );

    long monthsPassed = TrustCalculator.calculateMonthsPassed(userProd.getCreatedAt().toLocalDate());
    BigDecimal executionAmount = TrustCalculator.calculateTotalExecution(monthlyTotal, monthsPassed);

    BigDecimal currentAmount = principalAmount
        .add(profit)
        .subtract(executionAmount);

    TrustProductResponse.ClaimAgent claimAgentDto = mapClaimAgent(userProd);
    Boolean agentViewEnabled = Boolean.TRUE.equals(userProd.getIsAgentView());

    return trustMapper.toProductResponse(
        userProd,
        currentAmount,
        profitRate,
        principalAmount,
        executionAmount,
        profit,
        executionSetting,
        claimAgentDto,
        agentViewEnabled
    );
  }

  private TrustProductResponse.ClaimAgent mapClaimAgent(TBUserProd userProd) {
    if (userProd.getClaimAgent() == null) {
      return null;
    }

    TBUser claimAgent = userProd.getClaimAgent();

    String relation = familyAuthRepository
        .findByGrantor_UserIdAndGrantee_UserId(userProd.getUser().getUserId(), claimAgent.getUserId())
        .map(auth -> auth.getRelationCd().getDescription())
        .orElse(null);

    return new TrustProductResponse.ClaimAgent(
        String.valueOf(claimAgent.getUserId()),
        claimAgent.getUserNm(),
        relation
    );
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

  private TrustProductResponse.ExecutionSetting mapExecutionSetting(
      List<TrustPayoutSettingsDto.PayoutItemDto> items
  ) {
    boolean hospitalEnabled = false;
    BigDecimal hospitalAmount = BigDecimal.ZERO;
    boolean livingEnabled = false;
    BigDecimal livingAmount = BigDecimal.ZERO;

    if (items != null) {
      for (var item : items) {
        if (item.type() == TrustType.HOSPITAL) {
          hospitalEnabled = true;
          hospitalAmount = TrustCalculator.defaultIfNull(item.amount());
        }

        if (item.type() == TrustType.LIVING) {
          livingEnabled = true;
          livingAmount = TrustCalculator.defaultIfNull(item.amount());
        }
      }
    }

    return new TrustProductResponse.ExecutionSetting(
        hospitalEnabled,
        hospitalAmount,
        livingEnabled,
        livingAmount
    );
  }
}
