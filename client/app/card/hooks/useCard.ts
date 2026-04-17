export interface CardData {
  cardId: string;
  cardNm: string;
  autoTransAmt: number;
  limitAmt: number;
  isUse: boolean;
  designCd: string;
  payDay: number; // 추가
}
export interface UsageData {
  cardUsageId: string;
  usageNm: string;
  usageAmt: number;
  createdAt: string;
  abnmlYn: string;
}
