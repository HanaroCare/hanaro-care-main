package com.server.inheritance.service;

import com.server.asset.dto.AssetSummaryDTO;
import com.server.asset.dto.dashboard.AssetDashboardResponse;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.service.AssetService;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.inheritance.dto.InheritanceContextDTO;
import com.server.inheritance.dto.InheritanceRequestDTO;
import com.server.inheritance.dto.InheritanceResponseDTO;
import com.server.inheritance.dto.LetterDTO;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.inheritance.repository.InheritDetailRepository;
import com.server.inheritance.repository.InheritLetterRepository;
import com.server.inheritance.repository.InheritPlanRepository;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.UserRepository;
import com.server.user.service.FamilyService;
import com.server.user.service.UserService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InheritanceService {

  private final InheritPlanRepository planRepository;
  private final InheritDetailRepository detailRepository;
  private final InheritLetterRepository letterRepository;
  private final AssetService assetService;
  private final UserService userService;
  private final FamilyService familyService;
  private final UserRepository userRepository;

  public InheritanceContextDTO getInheritanceContext(Long userId) {
    // AssetService의 대시보드 데이터를 호출
    AssetDashboardResponse dashboard = assetService.getAssetDashboard(userId);

    // 상속 화면용 Summary DTO로 변환하여 반환 (car, card 제외)
    return InheritanceContextDTO.builder()
        .assetSummary(convertToAssetSummary(dashboard))
        .familyMembers(familyService.getFamilyMembers(userId))
        .build();
  }

  public InheritanceResponseDTO createOrUpdatePlan(Long userId, InheritanceRequestDTO request) {
    // Validate total ratio is 100%
    double totalRatio = request.getDistributions().stream()
        .mapToDouble(InheritanceRequestDTO.HeirDistributionDTO::getDistRatio)
        .sum();

    if (Math.abs(totalRatio - 100.0) > 0.001) {
      throw new ApiException(ErrorStatus.INHERIT_INVALID_RATIO);
    }

    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));

    // 자산 대시보드 데이터 호출 및 총 상속 자산 계산
    AssetDashboardResponse dashboard = assetService.getAssetDashboard(userId);

    AssetSummaryDTO assetSummary = convertToAssetSummary(dashboard);
    BigDecimal totalInheritAmt = assetSummary.getTotalAsset();

    // 세금 및 플랜 저장
    BigDecimal tax = calculateEstimatedTax(totalInheritAmt);

    TBInheritPlan plan = planRepository.findByUserId(userId)
        .orElse(TBInheritPlan.builder().user(user).build());

    plan.setTotalInheritAmt(totalInheritAmt);
    plan.setEstiTaxAmt(tax);
    plan = planRepository.save(plan);

    // 기존 상세 내역 삭제 및 새 내역 저장
    List<TBInheritDetail> existingDetails = detailRepository.findByInheritPlanId(plan.getId());
    detailRepository.deleteAll(existingDetails);

    List<InheritanceResponseDTO.HeirSummaryDTO> heirSummaries = new ArrayList<>();

    // 유류분 계산을 위한 총 가중치 합산
    double totalWeight = request.getDistributions().stream()
        .mapToDouble(d -> d.getRelation() == FamilyRelation.SPOUSE ? 1.5 : 1.0)
        .sum();

    BigDecimal netInheritAmt = totalInheritAmt.subtract(tax);

    for (InheritanceRequestDTO.HeirDistributionDTO dist : request.getDistributions()) {
      TBUser heir = null;
      String hName = dist.getHeirName();

      if (dist.getHeirUserId() != null) {
        heir = userRepository.findById(dist.getHeirUserId())
            .orElseThrow(() -> new ApiException(ErrorStatus.USER_NOT_FOUND));
        hName = heir.getUserNm();
      }

      TBInheritDetail detail = TBInheritDetail.builder()
          .inheritPlan(plan)
          .user(heir)
          .heirName(hName)
          .relationCd(dist.getRelation())
          .distRatio(BigDecimal.valueOf(dist.getDistRatio()))
          .build();

      detail = detailRepository.save(detail);

      BigDecimal distributedAmt = netInheritAmt
          .multiply(BigDecimal.valueOf(dist.getDistRatio()))
          .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

      // 유류분 계산 (법정상속분의 0.5)
      double weight = dist.getRelation() == FamilyRelation.SPOUSE ? 1.5 : 1.0;
      double minLegalRatio = (weight / totalWeight) * 0.5;
      BigDecimal minLegalAmt = netInheritAmt
          .multiply(BigDecimal.valueOf(minLegalRatio))
          .setScale(0, RoundingMode.HALF_UP);

      heirSummaries.add(InheritanceResponseDTO.HeirSummaryDTO.builder()
          .inheritDetailId(detail.getInheritDetailId())
          .heirUserId(heir != null ? heir.getUserId() : null)
          .heirName(hName)
          .relation(dist.getRelation())
          .distRatio(dist.getDistRatio())
          .distributedAmt(distributedAmt)
          .minLegalRatio(Math.round(minLegalRatio * 1000.0) / 1000.0)
          .minLegalAmt(minLegalAmt)
          .hasLetter(false)
          .build());
    }

    return InheritanceResponseDTO.builder()
        .planId(plan.getId())
        .totalInheritAmt(totalInheritAmt)
        .estiTaxAmt(tax)
        .heirs(heirSummaries)
        .build();
  }

  public InheritanceResponseDTO getPlanSummary(Long userId) {
    TBInheritPlan plan = planRepository.findByUserId(userId)
        .orElseThrow(
            () -> new ApiException(ErrorStatus.INHERIT_PLAN_NOT_FOUND));

    List<TBInheritDetail> details = detailRepository.findByInheritPlanId(plan.getId());

    List<InheritanceResponseDTO.HeirSummaryDTO> heirSummaries = details.stream()
        .map(d -> {
          BigDecimal netInheritAmt = plan.getTotalInheritAmt().subtract(plan.getEstiTaxAmt());

          BigDecimal distributedAmt = netInheritAmt
              .multiply(d.getDistRatio())
              .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

          boolean hasLetter = d.getInheritLetter() != null;
          Long letterId = hasLetter ? d.getInheritLetter().getLetterId() : null;

          return InheritanceResponseDTO.HeirSummaryDTO.builder()
              .inheritDetailId(d.getInheritDetailId())
              .heirUserId(d.getUser() != null ? d.getUser().getUserId() : null)
              .heirName(d.getHeirName())
              .relation(d.getRelationCd())
              .distRatio(d.getDistRatio().doubleValue())
              .distributedAmt(distributedAmt)
              .hasLetter(hasLetter)
              .letterId(letterId)
              .build();
        })
        .collect(Collectors.toList());

    return InheritanceResponseDTO.builder()
        .planId(plan.getId())
        .totalInheritAmt(plan.getTotalInheritAmt())
        .estiTaxAmt(plan.getEstiTaxAmt())
        .heirs(heirSummaries)
        .build();
  }

  public LetterDTO getLetter(Long letterId) {
    TBInheritLetter letter = letterRepository.findById(letterId)
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_LETTER_NOT_FOUND));

    return LetterDTO.builder()
        .letterId(letter.getLetterId())
        .inheritDetailId(letter.getInheritDetail().getInheritDetailId())
        .letterType(letter.getLetterTypeCd())
        .content(letter.getLetterCont())
        .voiceUrl(letter.getVoiceUrl())
        .build();
  }

  public LetterDTO createOrUpdateLetter(LetterDTO dto) {
    TBInheritDetail detail = detailRepository.findById(dto.getInheritDetailId())
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_HEIR_NOT_FOUND));

    TBInheritLetter letter = detail.getInheritLetter();
    if (letter == null) {
      letter = TBInheritLetter.builder()
          .inheritDetail(detail)
          .build();
    }

    letter.setLetterTypeCd(dto.getLetterType());
    letter.setLetterCont(dto.getContent());
    letter.setVoiceUrl(dto.getVoiceUrl());

    letter = letterRepository.save(letter);

    return LetterDTO.builder()
        .letterId(letter.getLetterId())
        .inheritDetailId(detail.getInheritDetailId())
        .letterType(letter.getLetterTypeCd())
        .content(letter.getLetterCont())
        .voiceUrl(letter.getVoiceUrl())
        .build();
  }

  private BigDecimal calculateEstimatedTax(BigDecimal amount) {
    BigDecimal deduction = new BigDecimal("500000000");
    BigDecimal taxableAmount = amount.subtract(deduction);

    if (taxableAmount.compareTo(BigDecimal.ZERO) <= 0) {
      return BigDecimal.ZERO;
    }

    return taxableAmount.multiply(new BigDecimal("0.20")).setScale(0, RoundingMode.HALF_UP);
  }

  // Dashboard 데이터를 AssetSummaryDTO로 변환하는 헬퍼 메서드
  private AssetSummaryDTO convertToAssetSummary(AssetDashboardResponse dashboard) {
    BigDecimal savings = BigDecimal.ZERO;
    BigDecimal stocks = BigDecimal.ZERO;
    BigDecimal pensions = BigDecimal.ZERO;
    BigDecimal others = BigDecimal.ZERO;
    BigDecimal realEstate = BigDecimal.ZERO;

    if (dashboard.financialAssets() != null) {
      for (AssetDashboardResponse.FinancialAssetSummary fa : dashboard.financialAssets()) {
        if (fa.assetCateCd() == AssetCategory.CARD) {
          continue;
        }

        switch (fa.assetCateCd()) {
          case CASH -> savings = savings.add(fa.totalBalance());
          case STOCK -> stocks = stocks.add(fa.totalBalance());
          case PENSION, PENSION_NATIONAL, PENSION_RETIRE, PENSION_PERSONAL ->
              pensions = pensions.add(fa.totalBalance());
          default -> others = others.add(fa.totalBalance());
        }
      }
    }

    if (dashboard.realAssets() != null) {
      for (AssetDashboardResponse.RealAssetSummary ra : dashboard.realAssets()) {
        if (ra.assetCateCd() == RealAssetCategory.VEHICLE) {
          continue;
        }

        if (ra.assetCateCd() == RealAssetCategory.REAL_ESTATE) {
          realEstate = realEstate.add(ra.evalAmt());
        } else {
          others = others.add(ra.evalAmt());
        }
      }
    }

    BigDecimal total = savings.add(stocks).add(pensions).add(realEstate).add(others);

    return AssetSummaryDTO.builder()
        .savingsAndDeposits(savings)
        .stocksAndFunds(stocks)
        .pensions(pensions)
        .realEstate(realEstate)
        .otherAssets(others)
        .totalAsset(total)
        .build();
  }
}
