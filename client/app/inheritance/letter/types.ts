export type LetterType = 'VOICE' | 'WRITING';

export interface LetterRequestDto {
  id: number;
  letterTypeCd: LetterType;
  letterCont: string;
}

export interface LetterResponseDto {
  inheritDetailId: number;
  letterCont: string;
  voiceUrl?: string;
  letterTypeCd: LetterType;
}

export interface InheritanceSummaryDto {
  inheritDetailId: number;
  userId: number;
  username: string;
  percent: number;
  amt: number;
}
