'use server';

import { ServerFetchError, serverFetch } from '@/lib/serverFetch';

export type AssetDashboardResponse = {
  totalFinancialAmt: number;
  financialAssets: {
    assetCateCd: string;
    totalBalance: number;
  }[];
  realAssets: {
    realAssetId: number;
    assetCateCd: string;
    assetNm: string;
    evalAmt: number;
    assetSize: number;
    addr: string;
    assetDesc: string;
  }[];
};

export type LinkedHouse = {
  realAssetId: number;
  address: string;
  detail: string;
  price: number;
};

export type PensionForecastScenario = {
  scenarioType: 'UP' | 'BASE' | 'DOWN';
  scenarioLabel: string;
  annualRate: number;
  totalGrowthRate: number;
  predictedPrice: number;
  probability: number;
};

export type PensionForecastChartPoint = {
  year: number;
  upPrice: number;
  basePrice: number;
  downPrice: number;
};

export type PensionForecastResponse = {
  realAssetId: number;
  assetNm: string;
  currentPrice: number;
  periodYears: number;
  expectedPrice: number;
  scenarios: PensionForecastScenario[];
  chartPoints: PensionForecastChartPoint[];
  recommendedScenario: 'UP' | 'BASE' | 'DOWN';
  marketSummary: string;
  locationSummary: string;
  recommendedReason: string;
  modelVersion: string;
  predictedAt: string;
};

export type PensionPayoutYearly = {
  year: number;
  monthlyAmount: number;
  cumulativeAmount: number;
};

export type PensionPayoutPlan = {
  type: 'FIXED' | 'FRONT_LOADED' | 'GROWING';
  label: string;
  totalCumulativeAmount: number;
  yearlyData: PensionPayoutYearly[];
};

export type PensionPayoutComparisonResponse = {
  recommendedType: 'FIXED' | 'FRONT_LOADED' | 'GROWING';
  recommendedLabel: string;
  plans: PensionPayoutPlan[];
};

export type PensionStatusChartPoint = {
  year: number;
  monthlyAmount: number;
  cumulativeAmount: number;
};

export type PensionStatusResponse = {
  pensionPayoutType: 'FIXED' | 'FRONT_LOADED' | 'GROWING';
  pensionPayoutLabel: string;
  createdAt: string;
  elapsedYear: number;
  currentMonthlyPayout: number;
  currentCumulativeAmount: number;
  chartPoints: PensionStatusChartPoint[];
};

export type PensionSimulationSummaryResponse = {
  recommendedType: 'FIXED' | 'FRONT_LOADED' | 'GROWING';
  recommendedLabel: string;
  recommendedMonthlyAmount: number;
  recommendedCumulativeAmount: number;
};

export type PensionPayoutHistoryRecord = {
  payoutDate: string;
  amount: number;
};

export type PensionPayoutHistoryResponse = {
  totalReceivedAmount: number;
  history: PensionPayoutHistoryRecord[];
};

export async function getPayoutComparison(
  realAssetId: number,
): Promise<PensionPayoutComparisonResponse> {
  return serverFetch<PensionPayoutComparisonResponse>(
    `/api/asset/pension/${realAssetId}/payout-comparison`,
  );
}

export async function getLinkedHouses(): Promise<LinkedHouse[]> {
  const dashboard = await serverFetch<AssetDashboardResponse>('/api/asset');

  return (dashboard.realAssets ?? [])
    .filter((asset) => asset.assetCateCd === 'REAL_ESTATE')
    .map((asset) => ({
      realAssetId: asset.realAssetId,
      address: asset.addr,
      detail: asset.assetDesc || `${asset.assetNm} · ${asset.assetSize}m²`,
      price: asset.evalAmt,
    }));
}

export async function getPensionForecast(
  realAssetId: number,
  periodYears = 5,
): Promise<PensionForecastResponse> {
  return serverFetch<PensionForecastResponse>(
    `/api/asset/pension/${realAssetId}/forecast?periodYears=${periodYears}`,
  );
}

export async function getPensionStatus(): Promise<PensionStatusResponse | null> {
  try {
    return await serverFetch<PensionStatusResponse>(
      '/api/asset/pension/status',
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['PENSION_NOT_SUBSCRIBED', 'PENSION_SIMULATION_NOT_FOUND'],
      })
    ) {
      return null;
    }
    throw error;
  }
}

export async function getPensionSimulationSummary(
  realAssetId: number,
): Promise<PensionSimulationSummaryResponse | null> {
  try {
    return await serverFetch<PensionSimulationSummaryResponse>(
      `/api/asset/pension/${realAssetId}/payout-summary`,
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['PENSION_SIMULATION_NOT_FOUND'],
      })
    ) {
      return null;
    }
    throw error;
  }
}

export async function getPayoutHistory(): Promise<PensionPayoutHistoryResponse | null> {
  try {
    return await serverFetch<PensionPayoutHistoryResponse>(
      '/api/asset/pension/payout-history',
    );
  } catch (error) {
    if (
      isNoDataError(error, {
        statuses: [404],
        codes: ['PENSION_NOT_SUBSCRIBED', 'PENSION_SIMULATION_NOT_FOUND'],
      })
    ) {
      return null;
    }
    throw error;
  }
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
