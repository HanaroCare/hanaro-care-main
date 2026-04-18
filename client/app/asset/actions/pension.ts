'use server';

import { ServerFetchError, serverFetch } from '@/lib/serverFetch';

export type AssetDashboardResponse = {
  totalFinancialAmt: number;
  financialAssets: {
    assetCateCd: string;
    totalBalance: number;
  }[];
  realAssets: {
    realAssetId: string;
    assetCateCd: string;
    assetNm: string;
    evalAmt: number | null;
    assetSize: number | null;
    addr: string | null;
    assetDesc: string | null;
  }[];
};

export type LinkedHouse = {
  realAssetId: string;
  address: string;
  detail: string[];
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
  realAssetId: string;
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
  realAssetId: string,
): Promise<PensionPayoutComparisonResponse> {
  return serverFetch<PensionPayoutComparisonResponse>(
    `/api/asset/pension/${realAssetId}/payout-comparison`,
  );
}

function parseAssetDesc(
  assetDesc: string | null,
  assetNm: string,
  assetSize: number | null,
): string[] {
  try {
    if (!assetDesc) {
      return [`${assetNm} · ${assetSize ?? '-'}m²`];
    }

    const parsed = JSON.parse(assetDesc) as {
      has_loan?: boolean;
      acquisition_year?: number;
      housing_type?: string;
    };

    const parts: string[] = [];
    if (parsed.housing_type) parts.push(parsed.housing_type);
    if (parsed.acquisition_year)
      parts.push(`${parsed.acquisition_year}년 취득`);
    if (parsed.has_loan != null)
      parts.push(parsed.has_loan ? '대출 있음' : '대출 없음');

    return parts.length > 0 ? parts : [`${assetNm} · ${assetSize ?? '-'}m²`];
  } catch {
    return [assetDesc || `${assetNm} · ${assetSize ?? '-'}m²`];
  }
}

export async function getLinkedHouses(): Promise<LinkedHouse[]> {
  const dashboard = await serverFetch<AssetDashboardResponse>('/api/asset');

  return (dashboard.realAssets ?? [])
    .filter((asset) => asset.assetCateCd === 'REAL_ESTATE')
    .map((asset) => ({
      realAssetId: asset.realAssetId,
      address: asset.addr ?? '',
      detail: parseAssetDesc(asset.assetDesc, asset.assetNm, asset.assetSize),
      price: asset.evalAmt ?? 0,
    }));
}

export async function getPensionForecast(
  realAssetId: string,
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
  realAssetId: string,
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
