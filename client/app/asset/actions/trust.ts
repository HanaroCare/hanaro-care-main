'use server';

import { serverFetch } from '@/lib/serverFetch';
import type { TrustFormState } from '@/app/asset/trust/TrustFormContext';

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
  selected: boolean;
};

export type TrustSimulationResultResponse = {
  selectedDetail: SimulationDetailDto;
  amountResults: AmountResultDto[];
};

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
      amount: id === 'hospital' ? form.payoutAmounts.hospital : form.payoutAmounts.living,
    }));

  const body: TrustSimulationRequest = {
    principalAmount: form.principalAmount,
    startType: START_TYPE_MAP[form.startTiming ?? 'now'] ?? 'NOW',
    startDate: form.startDate,
    investType: INVEST_TYPE_MAP[form.operationType] ?? 'LUMP_SUM',
    payoutType: PAYOUT_TYPE_MAP[form.payoutType ?? 'free'] ?? 'FLEXIBLE',
    payoutSettings: payoutItems.length > 0 ? { items: payoutItems } : null,
    claimAgentId: null,
  };

  return serverFetch<void>('/api/asset/trust', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
