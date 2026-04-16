import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type ApiResponse<T> = {
  isSuccess: boolean;
  result: T;
  message?: string;
};

/**
 * 1. 타입 정의 (백엔드 DTO 매칭)
 */

// 후견인 가족 요약 정보
export interface FamilySummaryDto {
  name: string;
  phoneNumber: string;
  relationCd: string;
}

// 계약서 생성을 위한 데이터
export interface ContractDto {
  guardianName: string;
  guardianRelation: string;
  permission: boolean[]; // [재산, 의료, 요양, 계약, 법적대리] (길이 5 고정)
}

// 보험 기본 정보
export interface InsuranceDto {
  accountId: number;
  instNm: string;
  accountNm: string;
  monthlyPremAmt: number;
  username: string;
}

export interface InsuranceListResponseDto {
  insurances: InsuranceDto[];
  isInsAgent: boolean;
}

// 보험 상세 정보
export interface InsuranceDetailDto {
  insuranceDto: InsuranceDto;
  contrDt: string; // LocalDate -> string (ISO)
  expireDt: string; // LocalDate -> string (ISO)
}
/**
 * 2. API 객체 선언
 */
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
