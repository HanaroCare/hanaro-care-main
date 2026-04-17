'use server';

import { serverFetch } from '@/lib/serverFetch';

export type AssetCategory = 'CASH' | 'PENSION' | 'CARD' | 'INSURANCE' | 'STOCK';

export interface AccountLinkItem {
  accountId: string;
  assetCateCd: AssetCategory;
  instNm: string;
  accountNm: string;
  accountNum: string;
  balanceAmt: number;
  isLinked: boolean;
}

export async function getConnectableAssets(): Promise<AccountLinkItem[]> {
  const result = await serverFetch<AccountLinkItem[]>('/api/asset/link');
  console.log('[mydata] getConnectableAssets OK — count:', result?.length ?? 0);
  if (result?.length > 0) {
    console.log('[mydata] first item:', JSON.stringify(result[0]));
  }
  return result ?? [];
}

export async function updateAssetLinkStatus(accountIds: string[]): Promise<void> {
  await serverFetch<string>('/api/asset/link', {
    method: 'PATCH',
    body: JSON.stringify(accountIds),
  });
}
