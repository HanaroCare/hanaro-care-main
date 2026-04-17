'use server';

import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/ApiResponse';
import type { ContractDto, FamilySummaryDto } from '../guardian/types/types';

const getAuthHeader = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('ACCESS_TOKEN')?.value;
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

const BASE_URL =
  process.env.SPRING_API_URL ??
  process.env.API_URL ??
  'http://localhost:8080';

// 1. 사용자 이름 조회
export async function getUserName() {
  const response = await fetch(`${BASE_URL}/api/myhana/family/me`, {
    headers: await getAuthHeader(),
  });

  if (!response.ok) throw new Error('사용자 정보를 가져오지 못했습니다.');
  const data: ApiResponse<string> = await response.json();
  return data.result;
}

// 2. 후견인 가족 조회
export async function getFamily() {
  const response = await fetch(`${BASE_URL}/api/myhana/guardian/family`, {
    headers: await getAuthHeader(),
  });

  if (!response.ok) throw new Error('가족 정보를 가져오지 못했습니다.');
  const data: ApiResponse<FamilySummaryDto[]> = await response.json();
  return data.result;
}

// 3. 임의후견인 계약서 문서 생성
export async function getContractBlob(dto: ContractDto) {
  const response = await fetch(`${BASE_URL}/api/myhana/guardian/contract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) throw new Error('계약서 생성에 실패했습니다.');

  return await response.blob();
}
