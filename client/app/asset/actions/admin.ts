'use server';

import { serverFetch } from '@/lib/serverFetch';

export async function subscribeTrustProduct(userId: number): Promise<{ userProdId: number }> {
  const result = await serverFetch<number>(`/api/admin/asset/trust/subscribe?userId=${userId}`, {
    method: 'POST',
  });
  return { userProdId: result };
}

export async function subscribePensionProduct(
  userId: number,
  realAssetId: number,
): Promise<{ userProdId: number }> {
  const result = await serverFetch<number>(
    `/api/admin/asset/pension/subscribe?userId=${userId}&realAssetId=${realAssetId}`,
    { method: 'POST' },
  );
  return { userProdId: result };
}

export async function enableAgentView(userId: number): Promise<void> {
  await serverFetch<string>(`/api/admin/asset/trust/agent-view?userId=${userId}`, {
    method: 'POST',
  });
}
