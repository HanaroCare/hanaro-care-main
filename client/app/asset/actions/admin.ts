'use server';

import { serverFetch } from '@/lib/serverFetch';

export async function subscribeTrustProduct(userId: string): Promise<{ userProdId: string }> {
  const result = await serverFetch<string>(`/api/admin/asset/trust/subscribe?userId=${userId}`, {
    method: 'POST',
  });
  return { userProdId: result };
}

export async function subscribePensionProduct(
  userId: string,
  realAssetId: string,
): Promise<{ userProdId: string }> {
  const result = await serverFetch<string>(
    `/api/admin/asset/pension/subscribe?userId=${userId}&realAssetId=${realAssetId}`,
    { method: 'POST' },
  );
  return { userProdId: result };
}

export async function enableAgentView(userId: string): Promise<void> {
  await serverFetch<string>(`/api/admin/asset/trust/agent-view?userId=${userId}`, {
    method: 'POST',
  });
}
