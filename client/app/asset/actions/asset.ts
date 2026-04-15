import { apiGet } from '@/lib/api/client';
import type { AssetDashboardResponse } from '../types';

export function getAssetDashboard(): Promise<AssetDashboardResponse> {
  return apiGet<AssetDashboardResponse>('/api/asset');
}