'use server';

import { serverFetch } from '@/lib/serverFetch';

export interface HousingLinkRequest {
  addr: string;
  housing_type: string;
  asset_size: number;
  acquisition_year: number;
  has_loan: boolean;
}

export interface VehicleLinkRequest {
  car_number: string;
}

export interface GoldLinkRequest {
  asset_size: number;
  purity: string;
}

export interface RealAssetLinkResult {
  realAssetId: number;
  assetNm: string;
  evalAmt: number;
  brand?: string | null;
  model?: string | null;
  registrationDt?: string | null;
}

/** 부동산 연동 — POST /api/real-assets/link/housing */
export async function linkHousing(
  data: HousingLinkRequest,
): Promise<RealAssetLinkResult> {
  return serverFetch<RealAssetLinkResult>('/api/real-assets/link/housing', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** 차량 연동 — POST /api/real-assets/link/vehicle */
export async function linkVehicle(
  data: VehicleLinkRequest,
): Promise<RealAssetLinkResult> {
  return serverFetch<RealAssetLinkResult>('/api/real-assets/link/vehicle', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** 금 자산 연동 — POST /api/real-assets/link/gold */
export async function linkGold(
  data: GoldLinkRequest,
): Promise<RealAssetLinkResult> {
  return serverFetch<RealAssetLinkResult>('/api/real-assets/link/gold', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

