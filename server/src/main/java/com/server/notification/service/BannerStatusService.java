package com.server.notification.service;

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
import com.server.notification.dto.BannerStatusResponse.MedicalBillInfo;
import com.server.notification.dto.BannerStatusResponse.PensionInfo;
import com.server.notification.dto.BannerStatusResponse.PensionItem;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public BannerStatusResponse getBannerStatus(Long userId) {
        return BannerStatusResponse.builder()
            .hasCompletedSimulation(resolveSimulation(userId))
            .hasInheritancePlan(resolveInheritancePlan(userId))
            .hasHousingPension(resolveHousingPension(userId))
            .hasTrustProduct(resolveTrustProduct(userId))
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
    // TBPensionSimulation 이 저장된 시점 = 설계 완료
    private boolean resolveHousingPension(Long userId) {
        return pensionSimulationRepository.existsByRealAsset_User_UserId(userId);
    }

    // ─── 신탁 상품 가입 여부 ───
    private boolean resolveTrustProduct(Long userId) {
        return userProdRepository.existsByUser_UserIdAndProdTypeAndProdStat(
            userId, ProdType.TRUST, ProdStat.IN_PROGRESS);
    }

    // ─── 요양보호사 카드 이번달 지출 ───
    // TBCard.autoTransAmt = 월 자동이체(청구) 금액, limitAmt = 월 한도
    // 카드가 없으면 null 반환 → MedicalBillCard 미표시
    private MedicalBillInfo resolveMedicalBill(Long userId) {
        List<TBCard> cards = cardRepository.findByAccount_User_UserIdAndIsUseTrue(userId);
        if (cards.isEmpty()) return null;

        TBCard card = cards.get(0);
        return MedicalBillInfo.builder()
            .usedAmount(card.getAutoTransAmt().longValue())
            .totalLimit(card.getLimitAmt().longValue())
            .build();
    }

    // ─── 이번달 연금 수령 정보 ───
    // TBAccount(PENSION)의 payDay 가 오늘이면 표시
    private PensionInfo resolvePension(Long userId) {
        int today = LocalDate.now().getDayOfMonth();

        List<TBAccount> pensionAccounts =
            accountRepository.findByUser_UserIdAndAssetCateCd(userId, AssetCategory.PENSION);

        List<TBAccount> todayPayAccounts = pensionAccounts.stream()
            .filter(a -> a.getPayDay() != null && a.getPayDay() == today)
            .toList();

        if (todayPayAccounts.isEmpty()) return null;

        long totalAmount = todayPayAccounts.stream()
            .filter(a -> a.getPayAmt() != null)
            .mapToLong(a -> a.getPayAmt().longValue())
            .sum();

        List<PensionItem> items = todayPayAccounts.stream()
            .filter(a -> a.getPayAmt() != null)
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
