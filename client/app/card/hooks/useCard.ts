import { useState } from "react";

export interface CardData {
  cardId: number;
  cardNm: string;
  balance: number;
  autoTransAmt: number;
  limitAmt: number;
  useYn: "Y" | "N";
}

export interface UsageData {
  cardUsageId: number;
  usageNm: string;
  usageAmt: number;
  createdAt: string;
  abnmlYn: "Y" | "N";
}

// TODO: 백엔드 연동 시 API로 교체
const MOCK_CARD: CardData = {
  cardId: 1,
  cardNm: "김복자 요양사의 카드",
  balance: 320000,
  autoTransAmt: 500000,
  limitAmt: 1000000,
  useYn: "Y",
};

const MOCK_USAGES: UsageData[] = [
  { cardUsageId: 1, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", abnmlYn: "N" },
  { cardUsageId: 2, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", abnmlYn: "N" },
];

export function useCard() {
  const [card, setCard] = useState<CardData | null>(MOCK_CARD);
  const [usages] = useState<UsageData[]>(MOCK_USAGES);
  const [showIssue, setShowIssue] = useState(false);

  const issueCard = () => {
    // TODO: POST /api/cards
    setCard(MOCK_CARD);
    setShowIssue(false);
  };

  return {
    card,
    usages,
    showIssue,
    setShowIssue,
    issueCard,
  };
}
