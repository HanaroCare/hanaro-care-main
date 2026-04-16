'use server';

import { serverFetch } from '@/lib/serverFetch';

export type MyInfo = {
  userId: number;
  loginId: string;
  userNm: string;
  userAge: number;
  userPhone: string;
  isHanaCert: boolean;
  userRole: string;
  userStatusCd: string;
  lastLoginAt: string;
};

export async function getMyInfo(): Promise<MyInfo | null> {
  try {
    return await serverFetch<MyInfo>('/api/users/me');
  } catch {
    return null;
  }
}
