export type AssetCategory = 'CASH' | 'PENSION' | 'CARD' | 'INSURANCE' | 'STOCK';
export type RealAssetCategory = 'REAL_ESTATE' | 'VEHICLE' | 'GOLD';

export interface AssetDashboardResponse {
  totalFinancialAmt: number;
  financialAssets: FinancialAssetSummary[];
  realAssets: RealAssetSummary[];
}

export interface FinancialAssetSummary {
  assetCateCd: AssetCategory;
  totalBalance: number;
}

export interface RealAssetSummary {
  realAssetId: number;
  assetCateCd: RealAssetCategory;
  assetNm: string;
  evalAmt: number | null;
  assetSize: number | null;
  addr: string | null;
  assetDesc: string | null;
}

export interface FinancialAssetResponse {
  accountId: number;
  assetCateCd: AssetCategory;
  instNm: string;
  accountNm: string;
  accountNum: string;
  balanceAmt: number;
  profitRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetDetailResponse {
  assetId: number;
  assetCateCd: AssetCategory | RealAssetCategory; // 둘 다 올 수 있음
  assetNm: string;
  amount: number;         // 실물(evalAmt), 금융(balanceAmt) 통합
  instNm?: string;        // 보험/계좌 전용
  addr?: string;          // 부동산 전용
  assetSize?: number;      // 부동산/금 전용
  assetDesc?: string;      // 실물자산 상세설명
  monthlyPremAmt?: number; // 보험 전용
  expireDt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceAssetResponse {
  assetId: number;
  assetCateCd: 'INSURANCE';
  assetNm: string;
  amount: number;
  instNm: string;
  addr: string | null;
  assetSize: number | null;
  monthlyPremAmt: number;
  expireDt: string;
  assetDesc: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * ─── 시뮬레이션(Simulation) 도메인 ───
 */
export type CareType = 'CENTER' | 'HOME' | 'HOSPITAL';

export interface SimulationSummary {
  is_sufficient: boolean;
  monthly_shortage_amt: number;
  total_income_amt: number;
  total_monthly_cost: number;
}

export interface CurrentSpending {
  living: number;
  medical: number;
  care: number;
}

/** POST /api/asset/simulation 응답 */
export interface SimulationResponse {
  simulation_id: number;
  summary: SimulationSummary;
  current_spending: CurrentSpending;
}

export interface AgeSegment {
  age: string;
  income: number;
  expense: number;
}

export interface SimulationDetailResponse extends SimulationResponse {
  chart_data: AgeSegment[];
  ai_opinion: string;
}

/** 백엔드 AgeSegment (range, income, expense, detail) */
export interface AgeSegmentApiResponse {
  range: string;
  income: number;
  expense: number;
  detail: {
    living: number;
    medical: number;
    care: number;
  };
}

/** GET /api/asset/simulation/summary 응답 (SimulationSummaryResponse) */
export interface SimulationSummaryApiResponse {
  sufficient: boolean;      // Java Boolean isSufficient → Jackson strips "is" prefix
  shortageAmt: number;
  livingCost: number;
  medicalCost: number;
  careCost: number;
  age_segments: AgeSegmentApiResponse[];
  ai_opinion: string;
}

/** POST /api/asset/simulation/detail 응답 (SimulationDetailResponse) */
export interface IncomeDetailsApiResponse {
  national_pension: number;
  retirement_pension: number;
  local_subsidy_amt: number;
  local_subsidy_name: string;
  total_monthly_income: number;
}

export interface SimulationDetailApiResponse {
  income_details: IncomeDetailsApiResponse;
  age_segments: AgeSegmentApiResponse[];
  ai_opinion: string;
}
