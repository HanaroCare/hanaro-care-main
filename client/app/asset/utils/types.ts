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

export interface AssetHistory {
  name: string;
  value: number;
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
