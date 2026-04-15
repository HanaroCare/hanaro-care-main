'use server';

import { serverFetch } from '@/lib/serverFetch';
import type { AssetDashboardResponse } from '../utils/types';

export async function getAssetDashboard(): Promise<AssetDashboardResponse> {
  return serverFetch<AssetDashboardResponse>('/api/asset');
}
