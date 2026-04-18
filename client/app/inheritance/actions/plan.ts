'use server';

import { serverFetch } from '@/lib/serverFetch';
import { revalidatePath } from 'next/cache';
import { getMyInfo } from '../../dev/actions/admin';

export interface HeirDistribution {
  heirUserId: number | null;
  heirName: string;
  relation: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
  distRatio: number;
}

export interface InheritancePlanRequest {
  distributions: HeirDistribution[];
}

export interface InheritancePlanResponse {
  planId: number;
  totalInheritAmt: number;
  estiTaxAmt: number;
  heirs: {
    inheritDetailId: number;
    heirUserId: number | null;
    heirName: string;
    relation: string;
    distRatio: number;
    distributedAmt: number;
    hasLetter: boolean;
  }[];
}

export interface InheritanceContext {
  assetSummary: {
    savingsAndDeposits: number;
    stocksAndFunds: number;
    pensions: number;
    realEstate: number;
    otherAssets: number;
    totalAsset: number;
  };
  familyMembers: {
    userId: number;
    name: string;
    relation: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
  }[];
}

/**
 * 상속 설계에 필요한 컨텍스트(자산, 가족) 정보를 가져옵니다.
 */
export async function getInheritanceContext() {
  try {
    const user = await getMyInfo();
    if (!user) throw new Error('Unauthorized: User info not found');
    
    return await serverFetch<InheritanceContext>(`/api/inheritance/context/${user.userId}`);
  } catch (error) {
    console.error('Failed to get inheritance context:', error);
    throw error;
  }
}

/**
 * 저장된 상속 설계 요약 정보를 가져옵니다.
 */
export async function getPlanSummary() {
  try {
    const user = await getMyInfo();
    if (!user) throw new Error('Unauthorized: User info not found');

    return await serverFetch<InheritancePlanResponse>(`/api/inheritance/summary/${user.userId}`);
  } catch (error) {
    console.error('Failed to get plan summary:', error);
    throw error;
  }
}

/**
 * 상속 설계 플랜을 서버에 저장합니다.
 * @param data 상속 비율 데이터
 */
export async function submitInheritancePlan(data: InheritancePlanRequest) {
  try {
    const user = await getMyInfo();
    if (!user) throw new Error('Unauthorized: User info not found');

    // 데이터 정제: null인 필드를 서버 사양에 맞춰 처리 (필요시)
    const sanitizedDistributions = data.distributions.map(d => ({
      ...d,
      heirUserId: d.heirUserId || null // undefined 방지
    }));

    const payload = { distributions: sanitizedDistributions };
    console.log('[submitInheritancePlan] Sending payload:', JSON.stringify(payload, null, 2));

    const result = await serverFetch<InheritancePlanResponse>(`/api/inheritance/plan/${user.userId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    revalidatePath('/inheritance/result');
    return result;
  } catch (error) {
    console.error('Failed to submit inheritance plan:', error);
    throw error;
  }
}
