'use server';

import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/ApiResponse';
import type {
  FamilyMemberResponse,
  FamilyInviteRequest,
  GrantInsuranceViewRequest,
} from '../family/types';

const getAuthHeader = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('AUTH_TOKEN')?.value;
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

const BASE_URL =
  process.env.SPRING_API_URL ??
  process.env.API_URL ??
  'http://localhost:8080';

// 1. 본인 이름 조회
export async function getMe() {
  const response = await fetch(`${BASE_URL}/api/myhana/family/me`, {
    headers: await getAuthHeader(),
  });

  if (!response.ok) throw new Error('본인 정보를 가져오지 못했습니다.');
  const data: ApiResponse<string> = await response.json();
  return data.result;
}

// 2. 가족 목록 조회
export async function getFamilyMembers() {
  const response = await fetch(`${BASE_URL}/api/myhana/family`, {
    headers: await getAuthHeader(),
  });

  if (!response.ok) throw new Error('가족 정보를 가져오지 못했습니다.');
  const data: ApiResponse<FamilyMemberResponse[]> = await response.json();
  return data.result;
}

// 3. 가족 초대 (초대 토큰 생성)
export async function inviteFamily(request: FamilyInviteRequest) {
  const response = await fetch(`${BASE_URL}/api/myhana/family/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) throw new Error('가족 초대 링크 생성에 실패했습니다.');
  const data: ApiResponse<string> = await response.json();
  return data.result;
}

// 4. 보험 내역 열람 권한 관리
export async function updateInsurancePermission(
  request: GrantInsuranceViewRequest,
) {
  const response = await fetch(
    `${BASE_URL}/api/myhana/family/insurance-permission`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) throw new Error('권한 업데이트에 실패했습니다.');
  const data: ApiResponse<null> = await response.json();
  return data.result;
}
