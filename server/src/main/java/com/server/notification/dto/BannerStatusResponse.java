package com.server.notification.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BannerStatusResponse {

    /** 로그인 사용자 이름 */
    private final String userName;

    /** 병원비 시뮬레이션 완료 여부 */
    private final boolean hasCompletedSimulation;

    /** 상속 설계(상속인 지정) 완료 여부 */
    private final boolean hasInheritancePlan;

    /** 주택연금 시뮬레이션(설계) 완료 여부 */
    private final boolean hasHousingPension;

    /** 신탁 상품 가입(연결) 여부 — InheritanceStepCard step 3 판별용 */
    private final boolean hasTrustProduct;

    /**
     * 주택연금 상품 실제 가입 정보.
     * 가입하지 않았으면 null → simulation-result 배너 미표시.
     */
    private final HousingPensionProductInfo housingPensionProduct;

    /**
     * 요양보호사 카드 이번달 지출 정보.
     * 카드가 없으면 null → MedicalBillCard 미표시.
     */
    private final MedicalBillInfo medicalBill;

    /**
     * 이번달 연금 수령 정보.
     * 오늘이 수령일인 연금 계좌가 없으면 null → PensionCard 미표시.
     */
    private final PensionInfo pension;

    @Getter
    @Builder
    public static class HousingPensionProductInfo {
        /** TBUserProd.monthlyPayout — 주택연금 월 수령액 */
        private final long monthlyPayout;
    }

    @Getter
    @Builder
    public static class MedicalBillInfo {
        /** 이번달 사용액 = limitAmt - balanceAmt */
        private final long usedAmount;
        /** 월 한도 = limitAmt */
        private final long totalLimit;
    }

    @Getter
    @Builder
    public static class PensionInfo {
        private final long totalAmount;
        private final List<PensionItem> items;
    }

    @Getter
    @Builder
    public static class PensionItem {
        /** TBAccount.instNm (국민연금, 퇴직연금 등) */
        private final String name;
        /** TBAccount.payAmt */
        private final long amount;
    }
}
