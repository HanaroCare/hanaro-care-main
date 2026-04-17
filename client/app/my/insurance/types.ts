export type Screen = 'family' | 'main' | 'detail'; // 보험 기본 정보

// 보험 정보
export interface InsuranceDto {
  accountId: string;
  instNm: string;
  accountNm: string;
  monthlyPremAmt: number;
  username: string;
}

// 보험 조회 dto
export interface InsuranceListResponseDto {
  insurances: InsuranceDto[];
  isInsAgent: boolean;
}

// 보험 상세 정보
export interface InsuranceDetailDto {
  insuranceDto: InsuranceDto;
  contrDt: string;
  expireDt: string;
}
