'use server';

import { serverFetch } from '@/lib/serverFetch';

export type MyInfo = {
  userId: number;
  userName: string;
  loginId: string;
  userRole: string;
  userAge?: number | null;
};

export type AdminUserSearchItem = {
  userId: number;
  userName: string;
  loginId: string;
  phoneNumber: string | null;
  userRole: string;
};

export type AdminUserDetail = {
  userId: number;
  userName: string;
  loginId: string;
  phoneNumber: string | null;
  userRole: string;
  userAge: number | null;
  userAddr: string | null;
};

export type AdminRealAssetItem = {
  realAssetId: number;
  assetNm: string;
  addr: string | null;
  evalAmt: number | null;
  assetSize: number | null;
  assetDesc: string | null;
};

export async function getMyInfo(): Promise<MyInfo | null> {
  try {
    return await serverFetch<MyInfo>('/api/admin/me');
  } catch {
    return null;
  }
}

export async function searchAdminUsers(
  keyword: string,
): Promise<AdminUserSearchItem[]> {
  return serverFetch<AdminUserSearchItem[]>(
    `/api/admin/asset/users/search?keyword=${encodeURIComponent(keyword)}`,
  );
}

export async function getAdminUserDetail(
  userId: number,
): Promise<AdminUserDetail> {
  return serverFetch<AdminUserDetail>(`/api/admin/asset/users/${userId}`);
}

export async function getAdminUserAssets(
  userId: number,
): Promise<AdminRealAssetItem[]> {
  return serverFetch<AdminRealAssetItem[]>(
    `/api/admin/asset/users/${userId}/real-assets`,
  );
}

export async function subscribeTrustProduct(userId: number): Promise<number> {
  return serverFetch<number>(
    `/api/admin/asset/trust/subscribe?userId=${userId}`,
    {
      method: 'POST',
    },
  );
}

export async function subscribePensionProduct(
  userId: number,
  realAssetId: number,
): Promise<number> {
  return serverFetch<number>(
    `/api/admin/asset/pension/subscribe?userId=${userId}&realAssetId=${realAssetId}`,
    {
      method: 'POST',
    },
  );
}

export async function enableAgentView(userId: number): Promise<string> {
  return serverFetch<string>(
    `/api/admin/asset/trust/agent-view?userId=${userId}`,
    {
      method: 'POST',
    },
  );
}
