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
export async function getInsuranceDetail(insuranceId: string) {
  try {
    // process.env.API_URL 대신 실제 서버 주소를 직접 넣어보세요 (예: http://localhost:8080)
    const baseUrl = process.env.API_URL || 'http://localhost:8080'; 
    const url = `${baseUrl}/api/myhana/insurances/${insuranceId}`;
    
    console.log("🚀 호출 주소:", url); // 서버 터미널에서 이 주소가 맞는지 꼭 확인!

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeader(),
      cache: 'no-store' // 상세 페이지는 항상 최신 정보를 가져오도록 설정
    });

    if (!response.ok) {
      console.error(`❌ 백엔드 응답 에러: ${response.status}`);
      return null; // 에러 시 throw 대신 null 반환
    }

    const data: ApiResponse<InsuranceDetailDto> = await response.json();
    console.log("📦 백엔드 결과:", data);
    return data.result;
  } catch (error) {
    console.error('getInsuranceDetail Error:', error);
    return null;
  }
}
