package com.server.notification.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.entity.enums.ProdStat;
import com.server.asset.entity.enums.ProdType;
import com.server.asset.repository.AccountRepository;
import com.server.asset.repository.AssetSimulationRepository;
import com.server.asset.repository.PensionSimulationRepository;
import com.server.asset.repository.UserProdRepository;
import com.server.card.entity.TBCard;
import com.server.card.repository.CardRepository;
import com.server.inheritance.repository.InheritPlanRepository;
import com.server.notification.dto.BannerStatusResponse;
import com.server.notification.dto.BannerStatusResponse.HousingPensionProductInfo;
import com.server.notification.dto.BannerStatusResponse.MedicalBillInfo;
import com.server.notification.dto.BannerStatusResponse.PensionInfo;
import com.server.notification.dto.BannerStatusResponse.PensionItem;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerStatusService {

    private final AssetSimulationRepository simulationRepository;
    private final InheritPlanRepository inheritPlanRepository;
    private final PensionSimulationRepository pensionSimulationRepository;
    private final UserProdRepository userProdRepository;
    private final CardRepository cardRepository;
    private final AccountRepository accountRepository;

    /**
     * @param userId   인증된 사용자 ID
     * @param userName 인증된 사용자 이름 (SubscriberDTO.getUserNm())
     */
    public BannerStatusResponse getBannerStatus(Long userId, String userName) {
        return BannerStatusResponse.builder()
            .userName(userName)
            .hasCompletedSimulation(resolveSimulation(userId))
            .hasInheritancePlan(resolveInheritancePlan(userId))
            .hasHousingPension(resolveHousingPension(userId))
            .hasTrustProduct(resolveTrustProduct(userId))
            .housingPensionProduct(resolveHousingPensionProduct(userId))
            .medicalBill(resolveMedicalBill(userId))
            .pension(resolvePension(userId))
            .build();
    }

    // ─── 병원비 시뮬레이션 완료 여부 ───
    private boolean resolveSimulation(Long userId) {
        return simulationRepository.existsByUser_UserId(userId);
    }

    // ─── 상속 설계 완료 여부 ───
    private boolean resolveInheritancePlan(Long userId) {
        return inheritPlanRepository.findByUserId(userId).isPresent();
    }

    // ─── 주택연금 시뮬레이션 완료 여부 ───
    private boolean resolveHousingPension(Long userId) {
        return pensionSimulationRepository.existsByRealAsset_User_UserId(userId);
    }

    // ─── 신탁 상품 가입 여부 (InheritanceStepCard step 3 판별용) ───
    private boolean resolveTrustProduct(Long userId) {
        return userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
            userId, ProdType.TRUST, ProdStat.IN_PROGRESS);
    }

    // ─── 주택연금 상품 실제 가입 정보 (simulation-result 배너용) ───
    // 시뮬레이션만 했을 때는 null, 실제 상품 가입 후에만 반환
    private HousingPensionProductInfo resolveHousingPensionProduct(Long userId) {
        return userProdRepository
            .findFirstByUser_UserIdAndProdTypeAndProdStatOrderByCreatedAtDesc(
                userId, ProdType.HOUSING_PENSION, ProdStat.IN_PROGRESS)
            .map(prod -> {
                BigDecimal payout = prod.getMonthlyPayout();
                if (payout == null) return null;
                return HousingPensionProductInfo.builder()
                    .monthlyPayout(payout.longValue())
                    .build();
            })
            .orElse(null);
    }

    // ─── 요양보호사 카드 이번달 지출 ───
    // usedAmount = limitAmt - balanceAmt
    // totalLimit = limitAmt
    private MedicalBillInfo resolveMedicalBill(Long userId) {
        List<TBCard> cards = cardRepository.findByAccount_User_UserIdAndIsUseTrue(userId);
        if (cards.isEmpty()) return null;

        long totalLimit = cards.stream()
                        .map(TBCard::getLimitAmt)
                        .filter(Objects::nonNull)
                        .mapToLong(BigDecimal::longValue)
                        .sum();

                    long totalBalance = cards.stream()
                        .map(TBCard::getBalanceAmt)
                        .filter(Objects::nonNull)
                        .mapToLong(BigDecimal::longValue)
                        .sum();

        return MedicalBillInfo.builder()
            .usedAmount(Math.max(0, totalLimit - totalBalance))
                        .totalLimit(totalLimit)
            .build();
    }

    // ─── 이번달 연금 수령 정보 ───
    // TBAccount(PENSION).payDay == 오늘 날짜인 계좌만
    // name = instNm, amount = payAmt
    private PensionInfo resolvePension(Long userId) {
        int today = LocalDate.now().getDayOfMonth();

        List<TBAccount> todayPayAccounts =
            accountRepository.findByUser_UserIdAndAssetCateCd(userId, AssetCategory.PENSION)
                .stream()
                .filter(a -> a.getPayDay() != null && a.getPayDay() == today)
                .filter(a -> a.getPayAmt() != null)
                .toList();

        if (todayPayAccounts.isEmpty()) return null;

        long totalAmount = todayPayAccounts.stream()
            .mapToLong(a -> a.getPayAmt().longValue())
            .sum();

        List<PensionItem> items = todayPayAccounts.stream()
            .map(a -> PensionItem.builder()
                .name(a.getInstNm())
                .amount(a.getPayAmt().longValue())
                .build())
            .toList();

        return PensionInfo.builder()
            .totalAmount(totalAmount)
            .items(items)
            .build();
    }
}
