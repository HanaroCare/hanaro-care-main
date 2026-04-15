package com.server.asset.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.asset.dto.trust.TrustAccessResponse;
import com.server.asset.dto.trust.TrustAgentViewUpdateRequest;
import com.server.asset.dto.trust.TrustGrantorResponse;
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
  private final UserRepository userRepository;
  private final FamilyAuthRepository familyAuthRepository;
  private final TrustMapper trustMapper;
  private final ObjectMapper objectMapper;

  @CheckUser(key = "#userId")
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

  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public TrustSimulationResultResponse getSimulationResult(Long userId) {
    TBTrustSimulation simulation = trustRepository
        .findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

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

  @Transactional(readOnly = true)
  public SimulationDetailDto getSimulationSummary(Long userId) {
    TBTrustSimulation simulation = trustRepository
        .findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.TRUST_SIMULATION_NOT_FOUND));

    return TrustCalculator.calculateDetail(
        TrustCalculator.defaultIfNull(simulation.getPrincipalAmount()),
        TrustCalculator.resolveAnnualRate(simulation.getInvestType())
    );
  }

  @CheckUser(key = "#userId")
  @Transactional(readOnly = true)
  public TrustProductResponse getProductSummary(Long userId) {
    TBUserProd userProd = userProdRepository.findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
        userId, ProdCate.TRUST, ProdStat.IN_PROGRESS
    ).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));
    return convertToProductResponse(userProd);
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustProductResponse getFamilyTrustDetail(Long granteeId, Long grantorId) {
    validateTrustAccess(granteeId, grantorId);

    TBUserProd userProd = userProdRepository.findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
        grantorId, ProdCate.TRUST, ProdStat.IN_PROGRESS
    ).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

    return convertToProductResponse(userProd);
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustGrantorResponse getFamilyGrantors(Long granteeId) {
    List<TrustGrantorResponse.GrantorItem> items = familyAuthRepository
        .findAllByGrantee_UserIdAndIsTrustViewTrue(granteeId)
        .stream()
        .map(auth -> new TrustGrantorResponse.GrantorItem(
            auth.getGrantor().getUserId(),
            auth.getGrantor().getUserNm(),
            auth.getRelationCd().name(),
            auth.getRelationCd().getDescription()
        ))
        .toList();
    return new TrustGrantorResponse(items);
  }

  /**
   * 가족의 신탁 접근 권한 리스트 조회 요청 바에 따른 매핑: 1. isProxy & canView -> READ_WRITE (전부 가능) 2. isProxy &
   * !canView -> PROXY_ONLY (권한은 있지만 확인 불가) 3. !isProxy & canView -> READ_WRITE (조회라도 가능해야 하므로
   * READ_WRITE 매핑) 4. !isProxy & !canView -> NONE (아무것도 아님)
   */
  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public TrustAccessResponse getFamilyAccessList(Long granteeId) {
    List<TrustAccessResponse.AccessItem> items = familyAuthRepository
        .findAllByGrantee_UserId(granteeId)
        .stream()
        .map(auth -> {
          boolean canView = Boolean.TRUE.equals(auth.getIsTrustView());
          boolean isProxy = Boolean.TRUE.equals(auth.getIsProxyClaim());

          TrustAccessLevel accessLevel;
          if (canView) {
            // 열람이 가능한 모든 케이스(조회전용 포함)는 READ_WRITE로 전달하여 UI 활성화
            accessLevel = TrustAccessLevel.READ_WRITE;
          } else if (isProxy) {
            // 열람은 안되는데 대리인 지정은 되어 있는 경우
            accessLevel = TrustAccessLevel.PROXY_ONLY;
          } else {
            accessLevel = TrustAccessLevel.NONE;
          }

          return new TrustAccessResponse.AccessItem(
              auth.getGrantor().getUserId(),
              auth.getGrantor().getUserNm(),
              accessLevel
          );
        })
        .toList();
    return new TrustAccessResponse(items);
  }

  @CheckUser(key = "#granteeId")
  @Transactional(readOnly = true)
  public void validateTrustAccess(Long granteeId, Long grantorId) {
    TBFamilyAuth familyAuth = familyAuthRepository
        .findByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId)
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

    // 열람 권한(isTrustView)이 없는 경우 상세 조회 불가
    if (!Boolean.TRUE.equals(familyAuth.getIsTrustView())) {
      throw new ApiException(ErrorStatus.TRUST_VIEW_FORBIDDEN);
    }
  }

  @CheckUser(key = "#userId")
  @Transactional
  public void updatePayoutSettings(Long userId, TrustPayoutSettingsUpdateRequest request) {
    TBUserProd userProd = userProdRepository.findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
        userId, ProdCate.TRUST, ProdStat.IN_PROGRESS
    ).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

    try {
      userProd.setPayoutSettings(objectMapper.writeValueAsString(request));
    } catch (Exception e) {
      throw new ApiException(ErrorStatus.TRUST_INVALID_PAYOUT_SETTINGS);
    }
  }

  @CheckUser(key = "#userId")
  @Transactional
  public void updateAgentView(Long userId, TrustAgentViewUpdateRequest request) {
    TBUserProd userProd = userProdRepository.findFirstByUser_UserIdAndProduct_ProdCateAndProdStatOrderByCreatedAtDesc(
        userId, ProdCate.TRUST, ProdStat.IN_PROGRESS
    ).orElseThrow(() -> new ApiException(ErrorStatus.PRODUCT_NOT_FOUND));

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

  private TrustProductResponse convertToProductResponse(TBUserProd userProd) {
    BigDecimal principalAmount = TrustCalculator.defaultIfNull(userProd.getPrincipalAmount());
    BigDecimal profit = TrustCalculator.defaultIfNull(userProd.getProfit());
    BigDecimal profitRate = TrustCalculator.defaultIfNull(userProd.getProfitRate());
    BigDecimal currentAmount = TrustCalculator.calculateCurrentAmount(principalAmount, profit);

    TrustSimulationSaveRequest.PayoutSettingsDto payoutSettings = parsePayoutSettings(
        userProd.getPayoutSettings());
    TrustProductResponse.ExecutionSetting executionSetting = mapExecutionSetting(
        payoutSettings.items());

    BigDecimal monthlyTotal = TrustCalculator.calculateMonthlyTotal(
        executionSetting.hospitalAmount(), executionSetting.livingAmount()
    );
    long monthsPassed = TrustCalculator.calculateMonthsPassed(
        userProd.getCreatedAt().toLocalDate());
    BigDecimal executionAmount = TrustCalculator.calculateTotalExecution(monthlyTotal,
        monthsPassed);

    return trustMapper.toProductResponse(
        userProd, currentAmount, profitRate, principalAmount, executionAmount, profit,
        executionSetting
    );
  }

  private TrustSimulationSaveRequest.PayoutSettingsDto parsePayoutSettings(String json) {
    try {
      if (json == null || json.isBlank()) {
        return new TrustSimulationSaveRequest.PayoutSettingsDto(List.of());
      }
      return objectMapper.readValue(json, TrustSimulationSaveRequest.PayoutSettingsDto.class);
    } catch (Exception e) {
      return new TrustSimulationSaveRequest.PayoutSettingsDto(List.of());
    }
  }

  private TrustProductResponse.ExecutionSetting mapExecutionSetting(
      List<TrustSimulationSaveRequest.PayoutSettingsDto.PayoutItemDto> items) {
    boolean hEnabled = false;
    BigDecimal hAmount = BigDecimal.ZERO;
    boolean lEnabled = false;
    BigDecimal lAmount = BigDecimal.ZERO;

    if (items != null) {
      for (var item : items) {
        if (item.type() == TrustType.HOSPITAL) {
          hEnabled = true;
          hAmount = TrustCalculator.defaultIfNull(item.amount());
        }
        if (item.type() == TrustType.LIVING) {
          lEnabled = true;
          lAmount = TrustCalculator.defaultIfNull(item.amount());
        }
      }
    }
    return new TrustProductResponse.ExecutionSetting(hEnabled, hAmount, lEnabled, lAmount);
  }
}
