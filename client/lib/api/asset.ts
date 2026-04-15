import { apiGet } from './client';
import type { AssetDashboardResponse } from '@/types/asset';

export function getAssetDashboard(): Promise<AssetDashboardResponse> {
  return apiGet<AssetDashboardResponse>('/api/asset');
}