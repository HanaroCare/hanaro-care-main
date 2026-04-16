// ─── AssetCategory (금융 자산 분류) ────────────────────────────────
export type AssetCategory = 'CASH' | 'PENSION' | 'CARD' | 'INSURANCE' | 'STOCK';

// ─── RealAssetCategory (실물 자산 분류) ───────────────────────────
export type RealAssetCategory = 'REAL_ESTATE' | 'VEHICLE' | 'GOLD';

// ─── GET /api/asset ────────────────────────────────────────────────
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
