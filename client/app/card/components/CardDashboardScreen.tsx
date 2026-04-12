"use client";

import { ChevronLeft, X, Settings } from "lucide-react";
import { CardData, UsageData } from "../hooks/useCard";
import CardView from "./CardView";
import UsageList from "./UsageList";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface CardDashboardScreenProps {
  card: CardData;
  usages: UsageData[];
  onAddCard: () => void;
}

const THRESHOLD = 80;

export default function CardDashboardScreen({ card, usages, onAddCard }: CardDashboardScreenProps) {
  const router = useRouter();
  const monthlyTotal = usages.reduce((sum, u) => sum + u.usageAmt, 0);
  const touchStartY = useRef<number>(0);
  const [dragY, setDragY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.touches[0].clientY;
    if (diff > 0) setDragY(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > THRESHOLD) {
      router.push("/card/usage");
    }
    setDragY(0);
  };

  return (
    <div className="relative w-[375px] min-h-[812px] bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 관리</span>
        <button className="p-1" onClick={() => router.back()}>
          <X size={24} color="#0A0A0A" />
        </button>
      </div>

      {/* 카드 영역 */}
      <div className="absolute w-[325px] left-6 top-[82px] bg-[#F6F7F8]/50 rounded-[30px] pb-6">
        {/* 카드 설정 변경 버튼 */}
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={() => router.push("/card/settings")}
            className="flex items-center gap-1 px-3 py-1 bg-hana-silver-100 rounded-xl text-xs font-medium text-black"
          >
            <Settings size={14} />
            카드 설정 변경
          </button>
        </div>

        {/* 카드 */}
        <div className="flex justify-center mt-2">
          <CardView cardNm={card.cardNm} />
        </div>

        {/* 카드 이름 */}
        <p className="text-center text-xl font-semibold tracking-tight text-hana-black-800 mt-4">
          {card.cardNm}
        </p>

        {/* 잔액 + 송금 */}
        <div className="flex items-center justify-between px-6 mt-3">
          <div>
            <p className="text-sm text-hana-black-500">잔액</p>
            <p className="text-base font-semibold tracking-tight text-hana-black-800">
              {card.balance.toLocaleString()}원
            </p>
          </div>
          <button
            onClick={() => router.push("/card/charge")}
            className="px-3 py-1 bg-hana-green-50 rounded-[15px] text-xs font-medium text-hana-ez-600"
          >
            송금하기
          </button>
        </div>
      </div>

      {/* 바텀시트 */}
      <div
        className="absolute w-[375px] top-[513px] bg-white rounded-t-[20px] pb-24"
        style={{
          boxShadow: "0px -4px 20px rgba(0,0,0,0.15)",
          transform: `translateY(-${Math.min(dragY * 0.3, 30)}px)`,
          transition: dragY === 0 ? "transform 0.3s ease" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        

        {/* 핸들 */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>

        {/* 월 소비 */}
        <div className="px-6 mt-6">
          <p className="text-xl font-medium text-[#101828] tracking-tight">4월 소비 내역</p>
          <p className="text-2xl font-medium text-[#101828] tracking-tight mt-1">
            {monthlyTotal.toLocaleString()}원
          </p>
        </div>

        {/* 지출 내역 */}
        <div className="px-[34px] mt-6">
          <UsageList usages={usages} cardNm={card.cardNm} />
        </div>

        {/* 더보기 텍스트 - 바텀시트 하단 */}
        {dragY > 20 && (
          <div className="flex justify-center pb-4 mt-4">
            <span className="px-4 py-2 bg-hana-green-50 rounded-full text-xl font-medium text-hana-green-700 animate-pulse">
              더보기
            </span>
          </div>
        )}
      </div>

      

      {/* 추가 발급 버튼 */}
      {/* <button
        onClick={onAddCard}
        className="fixed bottom-6 h-[53px] rounded-xl text-white text-base font-medium bg-hana-ez-600 hover:bg-hana-green-700 transition-colors"
        style={{ width: "327px", left: "calc(50% - 327px/2)" }}
      >
        + 카드 추가 발급
      </button> */}
    </div>
  );
}