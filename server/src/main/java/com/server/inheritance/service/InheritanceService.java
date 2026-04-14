package com.server.inheritance.service;

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
        return InheritanceContextDTO.builder()
                .assetSummary(assetService.getAssetSummaryByUserId(userId))
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
        BigDecimal totalAsset = assetService.getTotalAssetByUserId(userId);
        BigDecimal excludedAmt = assetService.getExcludedInheritAmtByUserId(userId);
        BigDecimal totalInheritAmt = totalAsset.subtract(excludedAmt);
        BigDecimal tax = calculateEstimatedTax(totalInheritAmt);

        // Save or update plan
        TBInheritPlan plan = planRepository.findByUserId(userId)
                .orElse(TBInheritPlan.builder().user(user).build());
        
        plan.setTotalInheritAmt(totalInheritAmt);
        plan.setEstiTaxAmt(tax);
        plan = planRepository.save(plan);

        // Clear existing details (simple way for update)
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
        // Simple placeholder for Korean inheritance tax
        // Deduction approx 500M KRW
        BigDecimal deduction = new BigDecimal("500000000");
        BigDecimal taxableAmount = amount.subtract(deduction);
        
        if (taxableAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        // Basic 10% for first 100M after deduction, etc.
        // For simplicity: 20% flat of taxable amount
        return taxableAmount.multiply(new BigDecimal("0.20")).setScale(0, RoundingMode.HALF_UP);
    }
}
