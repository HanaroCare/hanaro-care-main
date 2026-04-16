'use server';

import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/ApiResponse';
import type {
  InsuranceDetailDto,
  InsuranceListResponseDto,
} from '../insurance/types';

// 인증 헤더를 가져오는 서버 전용 유틸
const getAuthHeader = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('AUTH_TOKEN')?.value;
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// 보험 목록 조회 (나 + 공유 허락한 유저)
export async function getInsurances() {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/myhana/insurances`,
      {
        method: 'GET',
        headers: await getAuthHeader(),
        next: { revalidate: 0 }, // 캐싱 방지 (필요 시 조정)
      },
    );

    if (!response.ok) throw new Error('보험 목록을 불러오지 못했습니다.');

    const data: ApiResponse<InsuranceListResponseDto> = await response.json();
    return data.result;
  } catch (error) {
    console.error('getInsurances Error:', error);
    throw error;
  }
}

// 보험 상세 조회
export async function getInsuranceDetail(insuranceId: number | string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/myhana/insurances/${insuranceId}`,
      {
        method: 'GET',
        headers: await getAuthHeader(),
      },
    );

    if (!response.ok) throw new Error('보험 상세 정보를 불러오지 못했습니다.');

    const data: ApiResponse<InsuranceDetailDto> = await response.json();
    return data.result;
  } catch (error) {
    console.error('getInsuranceDetail Error:', error);
    throw error;
  }
}
