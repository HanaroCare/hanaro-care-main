export type InheritanceMethod = 'once' | 'divided';

export interface Recipient {
  id: number;
  name: string;
  percentage: number;
  amount: number;
}

export type RecordingState = 'idle' | 'recording' | 'recorded';

export interface InheritanceLetterResult {
  nickname: string;
  recipientName: string;
  percentage: number;
  amount: string;
  yearsLater: number | null;
  method: InheritanceMethod;
  message?: string;
  audioUrl?: string;
}
