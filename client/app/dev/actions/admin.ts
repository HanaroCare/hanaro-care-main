'use server';

import { serverFetch } from '@/lib/serverFetch';

export type MyInfo = {
  userId: string;
  userName: string;
  loginId: string;
  userRole: string;
  userAge?: number | null;
};

export type AdminUserSearchItem = {
  userId: string;
  userName: string;
  loginId: string;
  phoneNumber: string | null;
  userRole: string;
};

export type AdminUserDetail = {
  userId: string;
  userName: string;
  loginId: string;
  phoneNumber: string | null;
  userRole: string;
  userAge: number | null;
  userAddr: string | null;
};

export type AdminRealAssetItem = {
  realAssetId: string;
  assetNm: string;
  addr: string | null;
  evalAmt: number | null;
  assetSize: number | null;
  assetDesc: string | null;
};

export type AdminChildFamilyItem = {
  userId: string;
  userName: string;
  phoneNumber: string | null;
};

export async function getMyInfo(): Promise<MyInfo | null> {
  try {
    return await serverFetch<MyInfo>('/api/users/me');
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
  userId: string,
): Promise<AdminUserDetail> {
  return serverFetch<AdminUserDetail>(`/api/admin/asset/users/${userId}`);
}

export async function getAdminUserAssets(
  userId: string,
): Promise<AdminRealAssetItem[]> {
  return serverFetch<AdminRealAssetItem[]>(
    `/api/admin/asset/users/${userId}/real-assets`,
  );
}

export async function getAdminUserChildren(
  userId: string,
): Promise<AdminChildFamilyItem[]> {
  return serverFetch<AdminChildFamilyItem[]>(
    `/api/admin/asset/users/${userId}/children`,
  );
}

export async function subscribeTrustProduct(
  userId: string,
): Promise<{ userProdId: string }> {
  const userProdId = await serverFetch<string>(
    `/api/admin/asset/trust/subscribe?userId=${userId}`,
    {
      method: 'POST',
    },
  );
  return { userProdId };
}

export async function subscribePensionProduct(
  userId: string,
  realAssetId: string,
): Promise<string> {
  return serverFetch<string>(
    `/api/admin/asset/pension/subscribe?userId=${userId}&realAssetId=${realAssetId}`,
    {
      method: 'POST',
    },
  );
}

export async function updateClaimAgent(
  userId: string,
  agentUserId: string,
): Promise<string> {
  return serverFetch<string>(
    `/api/admin/asset/trust/claim-agent?userId=${userId}&agentUserId=${agentUserId}`,
    { method: 'POST' },
  );
}

export async function enableAgentView(userId: string): Promise<string> {
  return serverFetch<string>(
    `/api/admin/asset/trust/agent-view?userId=${userId}`,
    {
      method: 'POST',
    },
  );
}

export async function runTrustBatch(date?: string): Promise<string> {
  const query = date ? `?date=${date}` : '';
  return serverFetch<string>(`/api/admin/asset/batch/trust${query}`, {
    method: 'POST',
  });
}

export async function runPensionBatch(date?: string): Promise<string> {
  const query = date ? `?date=${date}` : '';
  return serverFetch<string>(`/api/admin/asset/batch/pension${query}`, {
    method: 'POST',
  });
}

export async function runSimulationEnqueue(): Promise<string> {
  return serverFetch<string>('/api/admin/asset/simulation/enqueue', {
    method: 'POST',
  });
}

export async function runSimulationBatchRun(): Promise<string> {
  return serverFetch<string>('/api/admin/asset/simulation/batch-run', {
    method: 'POST',
  });
}
