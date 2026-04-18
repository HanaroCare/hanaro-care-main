"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/navigation/Header";
import { CardData, UsageData } from "../../hooks/useCard";

const formatCardNm = (name: string) => `${name.slice(0, 3)} 카드`;

interface UsagesPerCard {
  card: CardData;
  usages: UsageData[];
}

interface Props {
  usagesPerCard: UsagesPerCard[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "오늘";
  if (date.toDateString() === yesterday.toDateString()) return "어제";
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function CardUsageClient({ usagesPerCard }: Props) {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    const allUsages = usagesPerCard.flatMap(({ card, usages }) =>
        usages.map((u) => ({ ...u, cardNm: formatCardNm(card.cardNm) })),
    );

    const filtered = selectedCardId
        ? allUsages.filter((u) => {
            const target = usagesPerCard.find((c) => c.card.cardId === selectedCardId);
            return u.cardNm === formatCardNm(target?.card.cardNm || "");
        })
        : allUsages;

    const grouped = filtered.reduce<Record<string, typeof filtered>>(
        (acc, item) => {
            const key = formatDate(item.createdAt);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        },
        {},
    );

  const totalAmt = filtered.reduce((sum, u) => sum + u.usageAmt, 0);

  const now = new Date();
  const monthAgo = new Date();
  monthAgo.setMonth(now.getMonth() - 1);
  const periodLabel = `${monthAgo.getMonth() + 1}월 ${monthAgo.getDate()}일 ~ ${now.getMonth() + 1}월 ${now.getDate()}일`;

  return (
    <div className="relative min-h-screen bg-white">
      <Header title="카드 입출금 내역" />

      <div className="px-6 mt-6">
        <p className="text-sm text-[#6A7282]">{periodLabel}</p>
        <p className="text-2xl font-semibold tracking-tight text-black mt-1">
          {totalAmt.toLocaleString()}원
        </p>
      </div>

      <div className="flex gap-2 px-6 mt-4 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCardId(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCardId === null
              ? "bg-hana-green-700 text-white"
              : "bg-hana-silver-100 text-hana-black-900"
          }`}
        >
          전체
        </button>
        {usagesPerCard.map(({ card }) => (
          <button
            key={card.cardId}
            onClick={() => setSelectedCardId(card.cardId)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors max-w-[140px] truncate ${
              selectedCardId === card.cardId
                ? "bg-hana-green-700 text-white"
                : "bg-hana-silver-100 text-hana-black-900"
            }`}
          >
            {card.cardNm}
          </button>
        ))}
      </div>

      <div className="px-8 mt-4 pb-8 flex flex-col gap-6">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-xs text-hana-black-500 leading-[30px] tracking-tight">
              {date}
            </p>
              <div className="flex flex-col gap-6">
                  {items.map((u) => (
                      <button
                          key={u.cardUsageId}
                          onClick={() =>
                              router.push(
                                  `/card/usage/${u.cardUsageId}?abnml=${u.abnmlYn}`,
                              )
                          }
                          className={`w-full flex justify-between items-start py-2 px-2 rounded-lg text-left transition-colors ${
                              u.abnmlYn === "Y" ? "bg-hana-red-50/50" : "bg-transparent active:bg-hana-silver-50"
                          }`}
                      >
                          <div>
                              <div className="flex items-center gap-2">
                                  <p className="text-[17px] font-semibold text-hana-black-800">
                                      {u.usageNm}
                                  </p>
                                  {u.abnmlYn === "Y" && (
                                      <span className="px-2 py-0.5 bg-hana-red-50 rounded-full text-[11px] font-semibold text-hana-red-500 border border-hana-red-100">
              이상
            </span>
                                  )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-hana-black-500">
            {formatTime(u.createdAt)}
          </span>
                                  <span className="w-[3px] h-[3px] rounded-full bg-hana-black-500 inline-block" />
                                  <span className="text-xs text-hana-black-500 max-w-[120px] truncate">
            {u.cardNm}
          </span>
                              </div>
                          </div>
                          <p
                              className={`text-base font-semibold ${
                                u.abnmlYn === "Y"
                                  ? "text-hana-red-500"
                                  : u.usageTypeCd === "CHARGE"
                                  ? "text-hana-green-700"
                                  : "text-hana-black-900"
                              }`}
                          >
                              {u.usageTypeCd === "CHARGE" ? "+" : "-"}{u.usageAmt.toLocaleString()}원
                          </p>
                      </button>
                  ))}
              </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-hana-black-400 mt-10">
            사용 내역이 없어요
          </p>
        )}
      </div>
    </div>
  );
}
