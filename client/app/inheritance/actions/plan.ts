'use server';

import { serverFetch } from '@/lib/serverFetch';
import { revalidatePath } from 'next/cache';
import { getMyInfo } from '../../dev/actions/admin';

export interface HeirDistribution {
  heirUserId: string | null;
  heirName: string;
  relation: 'SPOUSE' | 'CHILD' | 'PARENT' | 'FAMILY';
  distRatio: number;
}

export interface InheritancePlanRequest {
  distributions: HeirDistribution[];
}

export interface InheritancePlanResponse {
  planId: string;
  totalInheritAmt: number;
  estiTaxAmt: number;
  heirs: {
    inheritDetailId: string;
    heirUserId: string | null;
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
    userId: string;
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

export async function submitInheritancePlan(data: InheritancePlanRequest) {
  try {
    const user = await getMyInfo();
    if (!user) throw new Error('Unauthorized: User info not found');

    const sanitizedDistributions = data.distributions.map(d => ({
      ...d,
      distRatio: Math.round(Number(d.distRatio) * 10000) / 10000,
      heirUserId: d.heirUserId || null 
    }));

    const totalCurrent = sanitizedDistributions.reduce((sum, d) => sum + d.distRatio, 0);
    const diff = 1.0 - totalCurrent; 

    if (Math.abs(diff) > 0 && Math.abs(diff) < 0.01) {
      sanitizedDistributions[sanitizedDistributions.length - 1].distRatio += diff;
    }

    const payload = { distributions: sanitizedDistributions };
    
    console.log('[Payload Check]', payload.distributions.map(d => d.distRatio));
    console.log('[Sum Check]', payload.distributions.reduce((s, d) => s + d.distRatio, 0));

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
