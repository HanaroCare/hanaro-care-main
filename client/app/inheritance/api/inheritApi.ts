import axios from 'axios';
import type { ApiResponse } from '@/lib/ApiResponse';
import type { InheritanceSummaryDto, LetterResponseDto } from '../letter/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 2. API 함수들
export const inheritanceApi = {
  // 상속비율 및 가족 조회
  getInheritanceInfo: async () => {
    const response =
      await apiClient.get<InheritanceSummaryDto[]>('/api/inheritance');
    console.log(response);
    return response.data;
  },

  // 상속 편지 조회 (상세 페이지용)
  getLetter: async (inheritDetailId: string | number) => {
    const response = await apiClient.get<ApiResponse<LetterResponseDto>>(
      `/api/inheritance/letter/${inheritDetailId}`,
    );
    return response.data.result;
  },

  // 상속 편지 생성
  sendLetter: async (formData: FormData) => {
    const response = await apiClient.post('/api/inheritance/letter', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.result;
  },

  // 상속 편지 삭제
  deleteLetter: async (inheritDetailId: string | number) => {
    const response = await apiClient.delete(
      `/api/inheritance/letter/${inheritDetailId}`,
    );
    return response.data.result;
  },
};
