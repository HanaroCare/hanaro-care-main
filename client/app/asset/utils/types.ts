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
  assetCateCd: RealAssetCategory;
  totalValue: number;
}