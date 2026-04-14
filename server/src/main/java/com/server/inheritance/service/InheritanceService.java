package com.server.inheritance.service;

import com.server.asset.dto.AssetSummaryDTO;
import com.server.asset.dto.response.AssetDashboardResponse;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.RealAssetCategory;
import com.server.asset.service.AssetService;
import com.server.inheritance.dto.InheritanceContextDTO;
import com.server.inheritance.dto.InheritanceRequestDTO;
import com.server.inheritance.dto.InheritanceResponseDTO;
import com.server.inheritance.dto.LetterDTO;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.inheritance.repository.TBInheritDetailRepository;
import com.server.inheritance.repository.TBInheritLetterRepository;
import com.server.inheritance.repository.TBInheritPlanRepository;
import com.server.user.entity.TBUser;
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

    private final TBInheritPlanRepository planRepository;
    private final TBInheritDetailRepository detailRepository;
    private final TBInheritLetterRepository letterRepository;
    private final AssetService assetService;
    private final UserService userService;
    private final FamilyService familyService;

    public InheritanceContextDTO getInheritanceContext(Long userId) {
        // AssetService의 대시보드 데이터를 호출
        AssetDashboardResponse dashboard = assetService.getAssetDashboard(userId);
        
        // 상속 화면용 Summary DTO로 변환하여 반환
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
            throw new IllegalArgumentException("Total distribution ratio must be 100%. Current: " + totalRatio + "%");
        }

        TBUser user = userService.getUserById(userId);
        
        // 자산 대시보드 데이터 호출 및 총 상속 자산 계산
        AssetDashboardResponse dashboard = assetService.getAssetDashboard(userId);
        
        // 1. 전체 자산 (금융 + 실물 합계)
        BigDecimal totalRealAmt = dashboard.getRealAssets().stream()
                .map(AssetDashboardResponse.RealAssetSummary::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAsset = dashboard.getTotalFinancialAmt().add(totalRealAmt);

        // 2. 상속 제외 자산 계산 (카드 + 자동차)
        BigDecimal cardAmt = dashboard.getFinancialAssets().stream()
                .filter(a -> a.getAssetCateCd() == AssetCategory.CARD)
                .map(AssetDashboardResponse.FinancialAssetSummary::getTotalBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal vehicleAmt = dashboard.getRealAssets().stream()
                .filter(a -> a.getAssetCateCd() == RealAssetCategory.VEHICLE)
                .map(AssetDashboardResponse.RealAssetSummary::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal excludedAmt = cardAmt.add(vehicleAmt);
        BigDecimal totalInheritAmt = totalAsset.subtract(excludedAmt); // 순수 상속 대상 금액

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

        for (InheritanceRequestDTO.HeirDistributionDTO dist : request.getDistributions()) {
            TBUser heir = userService.getUserById(dist.getHeirUserId());
            
            TBInheritDetail detail = TBInheritDetail.builder()
                    .inheritPlan(plan)
                    .user(heir)
                    .relationCd(dist.getRelation())
                    .distRatio(dist.getDistRatio())
                    .build();
            
            detail = detailRepository.save(detail);

            BigDecimal distributedAmt = totalInheritAmt.subtract(tax)
                    .multiply(BigDecimal.valueOf(dist.getDistRatio()))
                    .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

            heirSummaries.add(InheritanceResponseDTO.HeirSummaryDTO.builder()
                    .inheritDetailId(detail.getInheritDetailId())
                    .heirUserId(heir.getUserId())
                    .heirName(heir.getUserNm())
                    .relation(dist.getRelation())
                    .distRatio(dist.getDistRatio())
                    .distributedAmt(distributedAmt)
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
                .orElseThrow(() -> new IllegalArgumentException("Inheritance plan not found for user: " + userId));

        List<TBInheritDetail> details = detailRepository.findByInheritPlanId(plan.getId());
        
        List<InheritanceResponseDTO.HeirSummaryDTO> heirSummaries = details.stream()
                .map(d -> {
                    BigDecimal distributedAmt = plan.getTotalInheritAmt().subtract(plan.getEstiTaxAmt())
                            .multiply(BigDecimal.valueOf(d.getDistRatio()))
                            .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
                    
                    boolean hasLetter = d.getInheritLetter() != null;
                    Long letterId = hasLetter ? d.getInheritLetter().getLetterId() : null;

                    return InheritanceResponseDTO.HeirSummaryDTO.builder()
                            .inheritDetailId(d.getInheritDetailId())
                            .heirUserId(d.getUser().getUserId())
                            .heirName(d.getUser().getUserNm())
                            .relation(d.getRelationCd())
                            .distRatio(d.getDistRatio())
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
                .orElseThrow(() -> new IllegalArgumentException("Letter not found: " + letterId));
        
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
                .orElseThrow(() -> new IllegalArgumentException("Inherit detail not found: " + dto.getInheritDetailId()));

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

        for (AssetDashboardResponse.FinancialAssetSummary fa : dashboard.getFinancialAssets()) {
            switch (fa.getAssetCateCd()) {
                case CASH -> savings = savings.add(fa.getTotalBalance());
                case STOCK -> stocks = stocks.add(fa.getTotalBalance());
                case PENSION -> pensions = pensions.add(fa.getTotalBalance());
                default -> others = others.add(fa.getTotalBalance());
            }
        }

        for (AssetDashboardResponse.RealAssetSummary ra : dashboard.getRealAssets()) {
            if (ra.getAssetCateCd() == RealAssetCategory.REAL_ESTATE) {
                realEstate = realEstate.add(ra.getTotalValue());
            } else {
                others = others.add(ra.getTotalValue());
            }
        }

        BigDecimal totalRealAmt = dashboard.getRealAssets().stream()
                .map(AssetDashboardResponse.RealAssetSummary::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal total = dashboard.getTotalFinancialAmt().add(totalRealAmt);

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
