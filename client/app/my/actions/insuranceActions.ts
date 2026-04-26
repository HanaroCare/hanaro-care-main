'use server';

import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/ApiResponse';
import type {
  InsuranceDetailDto,
  InsuranceListResponseDto,
} from '../insurance/types';

const getAuthHeader = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('ACCESS_TOKEN')?.value;
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

const BASE_URL =
  process.env.SPRING_API_URL ??
  process.env.API_URL ??
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

// 보험 목록 조회 (나 + 공유 허락한 유저)
export async function getInsurances() {
  try {
    const response = await fetch(
      `${BASE_URL}/api/myhana/insurances`,
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
export async function getInsuranceDetail(insuranceId: string) {
  try {
    const url = `${BASE_URL}/api/myhana/insurances/${insuranceId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`백엔드 응답 에러: ${response.status}`);
      return null; // 에러 시 throw 대신 null 반환
    }

    const data: ApiResponse<InsuranceDetailDto> = await response.json();
    console.log("백엔드 결과:", data);
    return data.result;
  } catch (error) {
    console.error('getInsuranceDetail Error:', error);
    return null;
  }
}
