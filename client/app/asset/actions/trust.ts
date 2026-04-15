'use server';

import type { TrustFormState } from '@/app/asset/trust/TrustFormContext';
import { serverFetch } from '@/lib/serverFetch';

type StartType = 'NOW' | 'SCHEDULED' | 'CUSTOM';
type InvestType = 'LUMP_SUM' | 'DIRECT';
type PayoutType = 'FLEXIBLE' | 'PENSION';
type TrustItemType = 'HOSPITAL' | 'LIVING';

type TrustSimulationRequest = {
  principalAmount: number;
  startType: StartType;
  startDate: string | null;
  investType: InvestType;
  payoutType: PayoutType;
  payoutSettings: {
    items: { type: TrustItemType; amount: number }[];
  } | null;
  claimAgentId: number | null;
};

const START_TYPE_MAP: Record<string, StartType> = {
  now: 'NOW',
  'when-needed': 'SCHEDULED',
  'custom-date': 'CUSTOM',
};

const INVEST_TYPE_MAP: Record<string, InvestType> = {
  managed: 'LUMP_SUM',
  self: 'DIRECT',
};

const PAYOUT_TYPE_MAP: Record<string, PayoutType> = {
  free: 'FLEXIBLE',
  pension: 'PENSION',
};

const PAYOUT_ITEM_TYPE: Record<string, TrustItemType> = {
  hospital: 'HOSPITAL',
  living: 'LIVING',
};

export type SimulationDetailDto = {
  principalAmount: number;
  expectedProfit: number;
  tax: number;
  expectedNetAmount: number;
  profitRate: number;
};

export type AmountResultDto = {
  label: string;
  principalAmount: number;
  expectedProfit: number;
  tax: number;
  expectedNetAmount: number;
  profitRate: number;
  isSelected: boolean;
};

export type TrustSimulationResultResponse = {
  selectedDetail: SimulationDetailDto;
  amountResults: AmountResultDto[];
};

export type TrustAccessLevel = 'READ_WRITE' | 'PROXY_ONLY' | 'NONE';

export type TrustAccessItem = {
  grantorId: number;
  grantorName: string;
  accessLevel: TrustAccessLevel;
};

export type TrustGrantorItem = {
  grantorId: number;
  grantorName: string;
  relation: string;
  relationLabel: string;
};

export type TrustGrantorResponse = {
  grantors: TrustGrantorItem[];
};

export type TrustSimulationSummary = {
  principalAmount: number;
  expectedProfit: number;
  tax: number;
  expectedNetAmount: number;
  profitRate: number;
};

export type TrustProductDetail = {
  userProdId: number;
  productName: string;
  prodStatus: 'IN_PROGRESS' | 'CANCELLED' | 'EXPIRED';
  currentAmount: number;
  profitRate: number;
  principalAmount: number;
  executionAmount: number;
  profit: number;
  executionSetting: {
    hospitalEnabled: boolean;
    hospitalAmount: number;
    livingEnabled: boolean;
    livingAmount: number;
  };
};

export type FamilyMember = {
  userId: number;
  name: string;
  phone: string;
  relation: string;
  isSharing: boolean;
  isMe: boolean;
};

export async function getTrustFamilyAccess(): Promise<TrustAccessItem[]> {
  try {
    const res = await serverFetch<{ accessList: TrustAccessItem[] }>(
      '/api/asset/trust/family/access',
    );
    return res.accessList ?? [];
  } catch {
    return [];
  }
}

export async function getTrustSimulationResult(): Promise<TrustSimulationResultResponse | null> {
  try {
    return await serverFetch<TrustSimulationResultResponse>('/api/asset/trust');
  } catch {
    return null;
  }
}

export async function saveTrustSimulation(form: TrustFormState): Promise<void> {
  const payoutItems = form.payoutItems
    .filter((id) => PAYOUT_ITEM_TYPE[id])
    .map((id) => ({
      type: PAYOUT_ITEM_TYPE[id],
      amount:
        id === 'hospital'
          ? form.payoutAmounts.hospital
          : form.payoutAmounts.living,
    }));

  const body: TrustSimulationRequest = {
    principalAmount: form.principalAmount,
    startType: START_TYPE_MAP[form.startTiming ?? 'now'] ?? 'NOW',
    startDate: form.startDate,
    investType: INVEST_TYPE_MAP[form.operationType] ?? 'LUMP_SUM',
    payoutType: PAYOUT_TYPE_MAP[form.payoutType ?? 'free'] ?? 'FLEXIBLE',
    payoutSettings: payoutItems.length > 0 ? { items: payoutItems } : null,
    claimAgentId: form.selectedAgent ? Number(form.selectedAgent) : null,
  };

  return serverFetch<void>('/api/asset/trust', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getTrustFamilyGrantors(): Promise<TrustGrantorItem[]> {
  try {
    const res = await serverFetch<TrustGrantorResponse>(
      '/api/asset/trust/family/grantors',
    );
    return res.grantors ?? [];
  } catch {
    return [];
  }
}

export async function getFamilyTrustSummary(
  grantorId: number,
): Promise<TrustSimulationSummary | null> {
  try {
    return await serverFetch<TrustSimulationSummary>(
      `/api/asset/trust/family/${grantorId}/summary`,
    );
  } catch {
    return null;
  }
}

export async function getFamilyTrustDetail(
  grantorId: number,
): Promise<TrustProductDetail | null> {
  try {
    return await serverFetch<TrustProductDetail>(
      `/api/asset/trust/family/${grantorId}/detail`,
    );
  } catch {
    return null;
  }
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  try {
    return await serverFetch<FamilyMember[]>('/api/myhana/family');
  } catch {
    return [];
  }
}

export async function getTrustSimulationSummary(): Promise<TrustSimulationSummary | null> {
  try {
    return await serverFetch<TrustSimulationSummary>(
      '/api/asset/trust/summary',
    );
  } catch {
    return null;
  }
}

export async function getTrustProductSummary(): Promise<TrustProductDetail | null> {
  try {
    return await serverFetch<TrustProductDetail>(
      '/api/asset/trust/product/summary',
    );
  } catch {
    return null;
  }
}
