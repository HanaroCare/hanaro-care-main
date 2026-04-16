import axios from 'axios';
import type { ApiResponse } from '@/lib/ApiResponse';
import type { ContractDto, FamilySummaryDto } from '../guardian/types/types';
import type {
  InsuranceDetailDto,
  InsuranceListResponseDto,
} from '../insurance/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const myhanaApi = {
  // 사용자 이름 조회
  getUser: async () => {
    const response = await apiClient.get<ApiResponse<string>>(
      '/api/myhana/family/me',
    );
    return response.data.result;
  },

  // 후견인 가족 조회
  getFamily: async () => {
    const response = await apiClient.get<ApiResponse<FamilySummaryDto[]>>(
      '/api/myhana/guardian/family',
    );
    console.log(response.data);
    return response.data.result;
  },

  // 보험 목록 조회 (나 + 공유 허락한 유저)
  getInsurances: async () => {
    const response = await apiClient.get<ApiResponse<InsuranceListResponseDto>>(
      '/api/myhana/insurances',
    );
    return response.data.result;
  },

  // 보험 상세 조회
  getInsuranceDetail: async (insuranceId: number | string) => {
    const response = await apiClient.get<ApiResponse<InsuranceDetailDto>>(
      `/api/myhana/insurances/${insuranceId}`,
    );
    return response.data.result;
  },

  // 임의후견인 계약서 생성 및 다운로드
  downloadContract: async (dto: ContractDto) => {
    console.log(dto);
    const response = await apiClient.post(
      '/api/myhana/guardian/contract',
      dto,
      {
        responseType: 'blob', // 파일 다운로드를 위해 blob 설정 필수
      },
    );

    // 파일 다운로드 처리 로직
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contract.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
