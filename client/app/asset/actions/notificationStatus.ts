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
