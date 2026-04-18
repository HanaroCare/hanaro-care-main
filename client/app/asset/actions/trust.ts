'use server';

import type { TrustFormState } from '@/app/asset/trust/TrustFormContext';
import { ServerFetchError, serverFetch } from '@/lib/serverFetch';

type StartType = 'NOW' | 'SCHEDULED' | 'CUSTOM';
type InvestType = 'LUMP_SUM' | 'DIRECT';
type PayoutType = 'FLEXIBLE' | 'PENSION';
type TrustItemType = 'HOSPITAL' | 'LIVING';

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

export type TrustAccessLevel = 'READ_WRITE' | 'PROXY_ONLY' | 'NONE';
export type TrustType = 'HOSPITAL' | 'LIVING';

export type TrustPayoutItem = {
  type: TrustType;
  amount: number;
};

export type TrustPayoutSettingsDto = {
  items: TrustPayoutItem[];
};

type TrustSimulationRequest = {
  principalAmount: number;
  startType: StartType;
  startDate: string | null;
  investType: InvestType;
  payoutType: PayoutType;
  payoutSettings: TrustPayoutSettingsDto | null;
  claimAgentId: string | null;
};

export type TrustPayoutSettingsUpdateRequest = {
  payoutSettings: TrustPayoutSettingsDto;
};

export type TrustAgentViewUpdateRequest = {
  agentViewEnabled: boolean;
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

export type TrustGrantorItem = {
  grantorId: string;
  grantorName: string;
  relation: string;
  relationLabel: string;
  accessLevel: TrustAccessLevel;
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
  userProdId: string;
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
  claimAgent: {
    userId: string;
    userName: string;
    relation: string | null;
  } | null;
  agentViewEnabled: boolean;
};

export type FamilyMember = {
  userId: string;
  name: string;
  phone: string;
  relation: string;
  isSharing: boolean;
  isMe: boolean;
};

export async function getTrustSimulationResult(): Promise<TrustSimulationResultResponse | null> {
  try {
    return await serverFetch<TrustSimulationResultResponse>(
      '/api/asset/trust?view=detail',
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['TRUST_001'],
      })
    ) {
      return null;
    }

    throw error;
  }
}

export async function getTrustSimulationSummary(): Promise<TrustSimulationSummary | null> {
  try {
    return await serverFetch<TrustSimulationSummary>(
      '/api/asset/trust?view=summary',
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['TRUST_001'],
      })
    ) {
      return null;
    }

    throw error;
  }
}

export async function saveTrustSimulation(form: TrustFormState): Promise<void> {
  const startTimingType = form.startTiming?.type ?? 'now';
  const startType = START_TYPE_MAP[startTimingType] ?? 'NOW';

  const startDate =
    startTimingType === 'custom-date' && form.startTiming?.startDate
      ? `${form.startTiming.startDate}T00:00:00`
      : null;

  if (startTimingType === 'custom-date' && !startDate) {
    throw new Error('Custom start date is required.');
  }

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
    startType,
    startDate,
    investType: INVEST_TYPE_MAP[form.operationType] ?? 'LUMP_SUM',
    payoutType: PAYOUT_TYPE_MAP[form.payoutType ?? 'free'] ?? 'FLEXIBLE',
    payoutSettings: payoutItems.length > 0 ? { items: payoutItems } : null,
    claimAgentId: form.selectedAgent ?? null,
  };

  await serverFetch<void>('/api/asset/trust', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getTrustFamilyGrantors(): Promise<TrustGrantorItem[]> {
  const res = await serverFetch<TrustGrantorResponse>(
    '/api/asset/trust/family/grantors',
  );
  return res.grantors ?? [];
}

export async function getFamilyTrustSummary(
  grantorId: string,
): Promise<TrustSimulationSummary | null> {
  try {
    return await serverFetch<TrustSimulationSummary>(
      `/api/asset/trust/family/${grantorId}?view=summary`,
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['TRUST_001'],
      })
    ) {
      return null;
    }

    throw error;
  }
}

export async function getFamilyTrustDetail(
  grantorId: string,
): Promise<TrustProductDetail | null> {
  try {
    return await serverFetch<TrustProductDetail>(
      `/api/asset/trust/family/${grantorId}?view=detail`,
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['ASSET_001'],
      })
    ) {
      return null;
    }

    throw error;
  }
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  return serverFetch<FamilyMember[]>('/api/myhana/family');
}

export async function getTrustProduct(): Promise<TrustProductDetail | null> {
  try {
    return await serverFetch<TrustProductDetail>('/api/asset/trust/product');
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['ASSET_001'],
      })
    ) {
      return null;
    }

    throw error;
  }
}

export async function updateTrustPayoutSettings(
  payoutSettings: TrustPayoutSettingsDto,
): Promise<void> {
  const body: TrustPayoutSettingsUpdateRequest = {
    payoutSettings,
  };

  await serverFetch<void>('/api/asset/trust/product/payout-settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function updateTrustAgentView(
  body: TrustAgentViewUpdateRequest,
): Promise<void> {
  await serverFetch<void>('/api/asset/trust/product/agent-view', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

function isNoDataError(
  error: unknown,
  options?: {
    statuses?: number[];
    codes?: string[];
  },
): boolean {
  if (!(error instanceof ServerFetchError)) return false;

  const statuses = options?.statuses ?? [];
  const codes = options?.codes ?? [];

  if (typeof error.status === 'number' && statuses.includes(error.status)) {
    return true;
  }

  if (error.code && codes.includes(error.code)) {
    return true;
  }

  return false;
}
