"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";

interface UsageItem {
  id: number;
  usageNm: string;
  usageAmt: number;
  createdAt: string;
  cardNm: string;
  abnmlYn: "Y" | "N";
  date: string;
}

interface CardFilter {
  id: number;
  label: string;
}

const CARDS: CardFilter[] = [
  { id: 1, label: "요양보호사1" },
  { id: 2, label: "요양보호사2" },
  { id: 3, label: "오전 담당" },
];

const MOCK_USAGES: UsageItem[] = [
  { id: 1, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "오늘" },
  { id: 2, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "오늘" },
  { id: 3, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "Y", date: "오늘" },
  { id: 4, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "오늘" },
  { id: 5, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "오늘" },
  { id: 6, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "어제" },
  { id: 7, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "어제" },
  { id: 8, usageNm: "삼성서울병원", usageAmt: 9000, createdAt: "11:58", cardNm: "요양보호사1의 카드", abnmlYn: "N", date: "어제" },
];

export default function CardUsagePage() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(1);

  const filtered = MOCK_USAGES;
  const grouped = filtered.reduce<Record<string, UsageItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const totalAmt = filtered.reduce((sum, u) => sum + u.usageAmt, 0);

  return (
    <div className="relative min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10 sticky top-0 bg-white z-10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 지출 내역</span>
        <button className="p-1" onClick={() => router.back()}>
          <X size={24} color="#0A0A0A" />
        </button>
      </div>

      {/* 기간 및 총액 */}
      <div className="px-6 mt-6">
        <p className="text-sm text-[#6A7282]">3월 8일 ~ 4월 8일</p>
        <p className="text-2xl font-semibold tracking-tight text-black mt-1">
          {totalAmt.toLocaleString()}원
        </p>
      </div>

      {/* 카드 필터 탭 */}
      <div className="flex gap-2 px-6 mt-4">
        {CARDS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCard(c.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCard === c.id
                ? "bg-hana-green-700 text-white"
                : "bg-hana-silver-100 text-hana-black-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 날짜별 내역 */}
      <div className="px-8 mt-4 pb-8 flex flex-col gap-6">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-xs text-hana-black-500 leading-[30px] tracking-tight">{date}</p>
            <div className="flex flex-col gap-6">
              {items.map((u) => (
                <button
                  key={u.id}
                  onClick={() => router.push(`/card/usage/${u.id}?abnml=${u.abnmlYn}`)}
                  className={`w-full flex justify-between items-start py-2 px-2 rounded-lg text-left transition-colors ${
                    u.abnmlYn === "Y" ? "bg-hana-red-50/50" : "bg-transparent"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base text-hana-black-800">{u.usageNm}</p>
                      {u.abnmlYn === "Y" && (
                        <span className="px-2 py-0.5 bg-hana-red-50 rounded-full text-xs text-hana-red-500">
                          이상
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-hana-black-800">{u.createdAt}</span>
                      <span className="w-[3px] h-[3px] rounded-full bg-hana-black-500 inline-block" />
                      <span className="text-xs text-hana-black-800">{u.cardNm}</span>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${u.abnmlYn === "Y" ? "text-hana-red-500" : "text-hana-black-900"}`}>
                    {u.usageAmt.toLocaleString()}원
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}