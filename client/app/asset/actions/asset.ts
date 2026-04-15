'use server';

import { serverFetch } from '@/lib/serverFetch';
import type {AssetDashboardResponse, FinancialAssetResponse, InsuranceAssetResponse} from '../utils/types';

export async function getAssetDashboard(): Promise<AssetDashboardResponse> {
  return serverFetch<AssetDashboardResponse>('/api/asset');
}

export async function getFinancialAssets(): Promise<FinancialAssetResponse[]> {
  return serverFetch<FinancialAssetResponse[]>('/api/asset/financial');
}

export async function getInsuranceAssets(): Promise<InsuranceAssetResponse[]> {
  return serverFetch<InsuranceAssetResponse[]>('/api/asset/insurance');
}
