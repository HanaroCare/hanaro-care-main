/**
 * ─── 자산(Asset) 도메인 ───
 */
export type AssetCategory =
    | 'CASH'
    | 'PENSION_NATIONAL'
    | 'PENSION_RETIRE'
    | 'PENSION_PERSONAL'
    | 'PENSION'
    | 'CARD'
    | 'INSURANCE'
    | 'STOCK';
export type RealAssetCategory = 'REAL_ESTATE' | 'VEHICLE' | 'GOLD';

export interface AssetDashboardResponse {
    isMyDataLinked: boolean;
    totalFinancialAmt: number;
    financialAssets: FinancialAssetSummary[];
    realAssets: RealAssetSummary[];
}

export interface FinancialAssetSummary {
    assetCateCd: AssetCategory;
    totalBalance: number;
}

export interface RealAssetSummary {
    realAssetId: string;
    assetCateCd: RealAssetCategory;
    assetNm: string;
    evalAmt: number | null;
    assetSize: number | null;
    addr: string | null;
    assetDesc: string | null;
}

export interface FinancialAssetResponse {
    accountId: string;
    assetCateCd: AssetCategory;
    instNm: string;
    accountNm: string;
    accountNum: string;
    balanceAmt: number;
    profitRate: number;
    createdAt: string;
    updatedAt: string;
}

export interface InsuranceAssetResponse {
    assetId: string;
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

export interface AssetDetailResponse {
    assetId: string;
    assetCateCd: AssetCategory | RealAssetCategory;
    assetNm: string;
    amount: number;
    instNm?: string;
    addr?: string;
    assetSize?: number;
    assetDesc?: string;
    monthlyPremAmt?: number;
    expireDt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AssetChartPoint {
    month: string;
    value: number; // 억 단위
}

/**
 * ─── 시뮬레이션(Simulation) 도메인 ───
 */
export type CareType = 'CENTER' | 'HOME' | 'HOSPITAL';

export interface SimulationSummary {
    isSufficient: boolean;
    shortageMonthlyAmt: number;
    totalIncomeAmt: number;
    totalCost: number;
}

export interface CurrentSpending {
    living: number;
    medical: number;
    care: number;
}

// ◀ 추가: actions/simulation.ts에서 참조하는 POST 응답 타입
export interface SimulationResponse {
    simulationId: string;
    summary: SimulationSummary;
    currentSpending: CurrentSpending;
}

export interface AgeSegmentApiResponse {
    range: string;
    income: number;
    income_detail?: {
        national: number;
        retirement: number;
        subsidy: number;
    };
    expense: number;
    detail: {
        living: number;
        medical: number;
        care: number;
    };
}

export interface SimulationSummaryApiResponse {
    targetAge: number;
    isSufficient: boolean;
    shortageAmt: number;
    livingCost: number;
    medicalCost: number;
    careCost: number;
    age_segments: AgeSegmentApiResponse[];
    ai_opinion: string;
    housing_pension_monthly_payout?: number;
}

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
    is_linked: boolean;
}
