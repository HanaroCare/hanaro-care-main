package com.server.asset.service;

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
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 신탁 설계 저장/조회, 가입 상품 조회/수정,
 * 가족(부모) 기준 신탁 권한 및 조회 기능을 처리하는 서비스
 */
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

  // 신탁 설계 조건을 저장하거나 기존 데이터를 수정
  @CheckUser(key = "#userId")
  @Transactional
  public void saveSimulation(Long userId, TrustSimulationSaveRequest request) {
    TBUser user = getUser(userId);
    validateSimulationRequest(request);

    TBUser claimAgent = getClaimAgent(request.claimAgentId());

    TBTrustSimulation simulation = trustRepository.findByUser_UserId(userId)
        .orElse(TBTrustSimulation.builder().user(user).build());

    trustMapper.updateSimulation(request, claimAgent, simulation, trustMapperHelper);    trustRepository.save(simulation);
  }

  //로그인 사용자의 신탁 설계 요약 결과를 반환
  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public SimulationDetailDto getSimulationSummary(Long userId) {
    TBTrustSimulation simulation = getSimulation(userId);

    return TrustCalculator.calculateDetail(
        TrustCalculator.defaultIfNull(simulation.getPrincipalAmount()),
        TrustCalculator.resolveAnnualRate(simulation.getInvestType())
    );
  }

  //로그인 사용자의 신탁 설계 상세 결과와 차트 비교 데이터를 반환
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

  //로그인 사용자의 가입 신탁상품 운용 현황을 반환한다.
  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public TrustProductResponse getProduct(Long userId) {
    TBUserProd userProd = getInProgressTrustProduct(userId);
    return toProductResponse(userProd);
  }

  // 부모별 신탁 권한 목록을 반환한다.
  // 권한이 없는 부모도 NONE으로 포함한다.
  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustGrantorResponse getFamilyGrantors(Long granteeId) {
    List<TrustGrantorResponse.GrantorItem> items = familyAuthRepository
        .findAllByGrantee_UserId(granteeId)
        .stream()
        .map(auth -> new TrustGrantorResponse.GrantorItem(
            auth.getGrantor().getUserId(),
            auth.getGrantor().getUserNm(),
            auth.getRelationCd().name(),
            auth.getRelationCd().getDescription(),
            resolveAccessLevel(auth)
        ))
        .toList();

    return new TrustGrantorResponse(items);
  }

  //자녀/가족이 부모의 신탁 설계 요약 결과를 조회한다.
  // 열람 권한이 없는 경우 예외를 발생시킨다.
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

  //자녀/가족이 부모의 가입 신탁상품 운용 현황을 조회
  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustProductResponse getFamilyProduct(Long granteeId, Long grantorId) {
    validateTrustViewAccess(granteeId, grantorId);
    TBUserProd userProd = getInProgressTrustProduct(grantorId);
    return toProductResponse(userProd);
  }

  // 부모 신탁에 대한 열람 권한 보유 여부를 검증
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

  // 가입 신탁상품의 자금 집행 설정을 수정
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

  // 지급청구대리인의 신탁 열람 권한을 수정
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
      return TrustAccessLevel.READ_WRITE; // 대리인 + 읽기 가능
    }
    if (isProxy) {
      return TrustAccessLevel.PROXY_ONLY; // 대리인 + 읽기 불가
    }
    return TrustAccessLevel.NONE;
  }

  // 사용자 ID로 사용자를 조회한다.
  private TBUser getUser(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_USER_NOT_FOUND));
  }

  // 대리인 ID가 있으면 대리인 사용자를 조회
  private TBUser getClaimAgent(Long claimAgentId) {
    if (claimAgentId == null) {
      return null;
    }
    return userRepository.findById(claimAgentId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_CLAIM_AGENT_NOT_FOUND));
  }

  // 사용자 기준 신탁 설계 정보를 조회
  private TBTrustSimulation getSimulation(Long userId) {
    return trustRepository.findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));
  }

  // 사용자의 진행 중인 신탁상품 1건을 조회
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
        claimAgent.getUserId(),
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
