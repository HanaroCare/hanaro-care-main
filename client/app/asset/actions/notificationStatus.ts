'use server';

import { serverFetch } from '@/lib/serverFetch';

export type BannerStatusResponse = {
  hasCompletedSimulation: boolean;
  hasInheritancePlan: boolean;
  hasHousingPension: boolean;
  hasTrustProduct: boolean;
  medicalBill: { usedAmount: number; totalLimit: number } | null;
  pension: {
    totalAmount: number;
    items: { name: string; amount: number }[];
  } | null;
  // livingExpense 는 지출 데이터 미구축으로 항상 null
};

const EMPTY_STATUS: BannerStatusResponse = {
  hasCompletedSimulation: false,
  hasInheritancePlan: false,
  hasHousingPension: false,
  hasTrustProduct: false,
  medicalBill: null,
  pension: null,
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
