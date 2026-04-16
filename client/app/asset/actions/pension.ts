'use server';

import { serverFetch } from '@/lib/serverFetch';

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

export type PensionForecastResponse = {
  realAssetId: number;
  assetNm: string;
  currentPrice: number;
  periodYears: number;
  expectedPrice: number;
  scenarios: {
    scenarioType: 'UP' | 'BASE' | 'DOWN';
    scenarioLabel: string;
    annualRate: number;
    totalGrowthRate: number;
    predictedPrice: number;
    probability: number;
  }[];
  chartPoints: {
    year: number;
    upPrice: number;
    basePrice: number;
    downPrice: number;
  }[];
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

export type ChartPoint = {
  year: number;
  monthlyAmount: number;
  cumulativeAmount: number;
};

export type PensionStatusResponse = {
  pensionPayoutType: string;
  pensionPayoutLabel: string;
  startDate: string;
  elapsedYear: number;
  currentMonthlyPayout: number;
  currentCumulativeAmount: number;
  chartPoints: ChartPoint[];
};

export type PensionSimulationSummaryResponse = {
  recommendedType: 'FIXED' | 'FRONT_LOADED' | 'GROWING';
  recommendedLabel: string;
  recommendedMonthlyAmount: number;
  recommendedCumulativeAmount: number;
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
  periodYears: number = 5,
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
    // 가입 내역이 없는 경우 404 등이 발생할 수 있으므로 null 반환 처리
    console.warn('주택연금 가입 현황이 없습니다.');
    return null;
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
    // 설계 내역이 없는 경우 null 반환
    console.warn('저장된 주택연금 설계 내역이 없습니다.');
    return null;
  }
}
