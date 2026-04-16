package com.server.notification.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BannerStatusResponse {

    /** 병원비 시뮬레이션 완료 여부 */
    private final boolean hasCompletedSimulation;

    /** 상속 설계(상속인 지정) 완료 여부 */
    private final boolean hasInheritancePlan;

    /** 주택연금 시뮬레이션(설계) 완료 여부 */
    private final boolean hasHousingPension;

    /** 신탁 상품 가입(연결) 여부 */
    private final boolean hasTrustProduct;

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

    // livingExpense 는 지출 데이터 미구축 상태이므로 항상 null

    @Getter
    @Builder
    public static class MedicalBillInfo {
        private final long usedAmount;
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
        private final String name;
        private final long amount;
    }
}
