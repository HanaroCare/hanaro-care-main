'use server';

import { serverFetch } from '@/lib/serverFetch';

export type BannerStatusResponse = {
  userName: string;
  hasCompletedSimulation: boolean;
  hasInheritancePlan: boolean;
  hasHousingPension: boolean;
  hasTrustProduct: boolean;
  /** 주택연금 상품 실제 가입 시에만 존재. 시뮬레이션만으로는 null */
  housingPensionProduct: { monthlyPayout: number } | null;
  medicalBill: { usedAmount: number; totalLimit: number } | null;
  pension: {
    totalAmount: number;
    items: { name: string; amount: number }[];
  } | null;
  /** 초대 링크를 통해 가입한 미인증 유저 여부 (grantee이며 하나 인증 미완) */
  isInvitedUser: boolean;
  /** 가족을 초대한 적 있는 grantor 여부. true이면 초대 배너를 노출하지 않음 */
  isGrantor: boolean;
  /** 이상 거래(ABNML_YN=Y)가 있는 카드 ID 목록. TSID 정밀도 유지를 위해 string[] */
  abnormalCardIds: string[];
  /** 카드가 1개일 때 이동할 가장 최근 이상 거래 USAGE_ID. TSID 정밀도 유지를 위해 string */
  firstAbnormalUsageId: string | null;
};

const EMPTY_STATUS: BannerStatusResponse = {
  userName: '',
  hasCompletedSimulation: false,
  hasInheritancePlan: false,
  hasHousingPension: false,
  hasTrustProduct: false,
  housingPensionProduct: null,
  medicalBill: null,
  pension: null,
  isInvitedUser: false,
  isGrantor: false,
  abnormalCardIds: [],
  firstAbnormalUsageId: null,
};

export async function getBannerStatus(): Promise<BannerStatusResponse> {
  try {
    return await serverFetch<BannerStatusResponse>(
      '/api/notifications/banner-status',
    );
  } catch {
    return EMPTY_STATUS;
  }
}
