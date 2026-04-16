'use server';

import { ServerFetchError, serverFetch } from '@/lib/serverFetch';

// ─── 주택연금 설계 완료 여부 ───
export async function getHousingPensionStatus(): Promise<boolean> {
  try {
    await serverFetch<unknown>('/api/asset/pension/status');
    return true;
  } catch {
    return false;
  }
}

// ─── 상속 설계 완료 여부 ───
// 백엔드에서 GET /api/inheritance/my/summary (@AuthenticationPrincipal 기반) 추가 필요
// 현재 /api/inheritance/summary/{userId} 는 userId를 path로 받아서 서버컴포넌트에서 직접 호출 불가
export async function getInheritancePlanStatus(): Promise<boolean> {
  try {
    await serverFetch<unknown>('/api/inheritance/my/summary');
    return true;
  } catch (error) {
    if (error instanceof ServerFetchError && error.status === 404) return false;
    // 엔드포인트 미구현 시 false 처리
    return false;
  }
}

// ─── 배치 기반 알림 상태 ───
// 백엔드에서 Spring Batch로 계산 후 GET /api/notifications/banner-status 제공 필요
export type BatchNotificationStatus = {
  medicalBill: { usedAmount: number; totalLimit: number } | null;
  pension: {
    totalAmount: number;
    items: { name: string; amount: number }[];
  } | null;
  livingExpense: { overAmount: number } | null;
};

export async function getBatchNotificationStatus(): Promise<BatchNotificationStatus> {
  try {
    return await serverFetch<BatchNotificationStatus>(
      '/api/notifications/banner-status',
    );
  } catch {
    return { medicalBill: null, pension: null, livingExpense: null };
  }
}
