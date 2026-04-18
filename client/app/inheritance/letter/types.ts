export type LetterType = 'VOICE' | 'WRITING';

export interface LetterRequestDto {
  id: string;
  letterTypeCd: LetterType;
  letterCont: string;
}

export interface LetterResponseDto {
  inheritDetailId: string;
  letterCont: string;
  voiceUrl?: string;
  letterTypeCd: LetterType;
}

export interface InheritanceSummaryDto {
  inheritDetailId: string;
  userId: string;
  username: string;
  percent: number;
  amt: number;
}
