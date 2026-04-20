'use server';

import {cookies} from 'next/headers';
import type {ApiResponse} from '@/lib/ApiResponse';
import type {
  FamilyInviteRequest,
  FamilyMemberResponse,
  GrantInsuranceViewRequest,
} from '../family/types';

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

  if (!response.ok) {
    const rawBody = await response.text().catch(() => '');
    let errorData: Record<string, unknown> = {};
    try { errorData = JSON.parse(rawBody); } catch { /* HTML 에러 페이지 등 */ }
    const serverMessage = (errorData.message as string) || '가족 초대 링크 생성에 실패했습니다.';
    console.error('[inviteFamily] 서버 에러 응답:', { status: response.status, code: errorData.code, message: errorData.message, rawBody: rawBody.slice(0, 300) });
    throw new Error(serverMessage);
  }
  const data: ApiResponse<string> = await response.json();
  // [DEBUG] 생성된 초대 토큰 확인 — 수락 시 전달값과 비교하여 일치 여부 검증
  console.log('[inviteFamily] 생성된 inviteToken:', data.result);
  return data.result;
}

// 4. 가족 초대 수락 (초대 토큰 → TB_FAMILY_AUTH GRANTOR/GRANTEE 등록)
export async function acceptFamilyInvite(inviteToken: string) {
  // [DEBUG] 수락 요청에 전달되는 토큰 — inviteFamily 반환값과 일치하는지 확인
  console.log('[acceptFamilyInvite] 전달된 inviteToken:', inviteToken);

  if (!inviteToken || inviteToken.trim() === '') {
    throw new Error('초대 토큰이 없습니다. 초대 링크를 다시 확인해 주세요.');
  }

  const response = await fetch(`${BASE_URL}/api/myhana/family/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ inviteToken }),
  });

  if (!response.ok) {
    // text()로 먼저 읽어야 500(HTML Whitelabel 등)도 안전하게 로깅 가능
    const rawBody = await response.text().catch(() => '');
    let errorData: Record<string, unknown> = {};
    try { errorData = JSON.parse(rawBody); } catch { /* HTML 에러 페이지 등 비-JSON 응답 */ }
    // 서버 응답 구조: { isSuccess, code, message, result }
    const serverMessage = (errorData.message as string) || '가족 초대 수락에 실패했습니다.';
    // [DEBUG] code로 원인 특정 (FAMILY4001 자기초대 / FAMILY4002 중복 / FAMILY4003 토큰불량 / ACCOUNT_404 계좌없음)
    console.error('[acceptFamilyInvite] 서버 에러 응답:', {
      status: response.status,
      code: errorData.code,
      message: errorData.message,
      rawBody: rawBody.slice(0, 500),
    });
    // 계좌 미연결 시 사용자에게 구체적인 안내
    const userFacingMessage =
      errorData.code === 'ACCOUNT_404'
        ? '연동할 계좌 정보가 없습니다. 마이데이터를 먼저 연결해 주세요.'
        : serverMessage;
    throw new Error(userFacingMessage);
  }
  const data: ApiResponse<null> = await response.json();
  return data.result;
}

// 5. 보험 내역 열람 권한 관리
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
