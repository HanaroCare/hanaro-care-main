import apiClient from '@/services/apiClient'; // axios 인스턴스

// 1. 타입 정의 (백엔드 DTO 기반)
export interface LetterRequestDto {
  id: number;
  letterTypeCd: 'VOICE' | 'WRITING';
  letterCont: string;
}

export interface LetterResponseDto {
  id: number;
  content: string;
  voiceUrl?: string;
}

export interface InheritanceSummaryDto {
  id: number;
  username: string;
  percent: number;
  amt: number;
}

// 2. API 함수들
export const inheritanceApi = {
  // 상속비율 및 가족 조회
  getInheritanceInfo: async () => {
    const response =
      await apiClient.get<InheritanceSummaryDto[]>('/inheritance');
    return response.data;
  },

  // 상속 편지 조회 (상세 페이지용)
  getLetter: async (inheritDetailId: string | number) => {
    const response = await apiClient.get<LetterResponseDto>(
      `/inheritance/letter/${inheritDetailId}`,
    );
    return response.data;
  },

  // 상속 편지 생성 (FormData 사용 - 음성 파일 포함)
  sendLetter: async (formData: FormData) => {
    const response = await apiClient.post('/inheritance/letter', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 상속 편지 삭제
  deleteLetter: async (inheritDetailId: string | number) => {
    const response = await apiClient.delete(
      `/inheritance/letter/${inheritDetailId}`,
    );
    return response.data;
  },
};

export const createLetterFormData = (data: {
  inheritDetailId: string;
  letterCont: string; // 기존 message -> letterCont
  letterTypeCd: 'WRITING' | 'VOICE'; // 백엔드 Enum 타입에 맞춰 정의
  audioBlob: Blob | null;
}) => {
  const formData = new FormData();

  // 1. DTO 필드명 매칭 (중요!)
  formData.append('inheritDetailId', data.inheritDetailId);
  formData.append('letterTypeCd', data.letterTypeCd);
  formData.append('letterCont', data.letterCont);

  // 2. 파일 추가 (@RequestPart("voice")와 매칭)
  if (data.audioBlob) {
    const file = new File([data.audioBlob], 'voice.mp3', {
      type: 'audio/mpeg',
    });
    formData.append('voice', file);
  }

  return formData;
};
