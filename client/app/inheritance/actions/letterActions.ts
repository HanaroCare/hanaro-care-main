'use server';

import { serverFetch } from '@/lib/serverFetch';
import type { InheritanceSummaryDto, LetterResponseDto } from '../letter/types';

// 상속비율 및 가족 조회
export async function getInheritanceInfo() {
  try {
    return await serverFetch<InheritanceSummaryDto[]>('/api/inheritance');
  } catch (error) {
    console.warn('[getInheritanceInfo] 상속 정보를 불러오지 못했습니다:', error);
    return []; // null 대신 빈 배열 반환하여 클라이언트에서의 에러 방지
  }
}

// 상속 편지 조회
export async function getLetter(inheritDetailId: string) {
  try {
    return await serverFetch<LetterResponseDto>(
      `/api/inheritance/letter/${inheritDetailId}`,
    );
  } catch (error) {
    console.error('[getLetter] 편지 조회 실패:', error);
    return null;
  }
}

// 상속 편지 생성
export async function sendLetter(formData: FormData) {
  try {
    // multipart/form-data 전송 (serverFetch에서 FormData 여부에 따라 Content-Type 자동 처리)
    return await serverFetch<LetterResponseDto>('/api/inheritance/letter', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('[sendLetter] 편지 생성 실패:', error);
    throw error;
  }
}

// 상속 편지 삭제
export async function deleteLetter(inheritDetailId: string) {
  try {
    return await serverFetch<string>(
      `/api/inheritance/letter/${inheritDetailId}`,
      {
        method: 'DELETE',
      },
    );
  } catch (error) {
    console.error('[deleteLetter] 편지 삭제 실패:', error);
    throw error;
  }
}
