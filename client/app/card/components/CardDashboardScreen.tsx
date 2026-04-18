"use client";

import { Settings, Plus } from "lucide-react";
import { CardData, UsageData } from "../hooks/useCard";
import CardView from "./CardView";
import UsageList from "./UsageList";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import { getCardBalance, getCardUsages } from "../actions/card";

interface CardDashboardScreenProps {
  cards: CardData[];
  usages: UsageData[];
  balance: number;
}

const THRESHOLD = 80;
const DESIGN_ORDER: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
};

export default function CardDashboardScreen({
  cards,
  usages,
  balance,
}: CardDashboardScreenProps) {
  const router = useRouter();
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const [dragY, setDragY] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // state 추가
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [currentUsages, setCurrentUsages] = useState(usages);

  // state 추가
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // 카드 전환 시 잔액 재조회
  const handleCardChange = async (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCardIndex(index);

    setTimeout(() => setIsAnimating(false), 350);

    if (index < cards.length) {
      const [newBalance, newUsages] = await Promise.all([
        getCardBalance(cards[index].cardId),
        getCardUsages(cards[index].cardId),
      ]);
      setCurrentBalance(newBalance);
      setCurrentUsages(newUsages);
    }
  };

  // cards + 마지막에 "추가" 슬라이드
  const ALL_SLIDES = [...cards, null];

  const isAddSlide = currentCardIndex >= cards.length;
  const currentCard = isAddSlide ? null : cards[currentCardIndex];
  const prevCard =
    currentCardIndex > 0 ? ALL_SLIDES[currentCardIndex - 1] : null;
  const nextSlide =
    currentCardIndex < ALL_SLIDES.length - 1
      ? ALL_SLIDES[currentCardIndex + 1]
      : undefined;

  const filteredUsages = isAddSlide ? [] : currentUsages;
  const monthlyTotal = filteredUsages.reduce((sum, u) => sum + u.usageAmt, 0);

  const handleSheetTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleSheetTouchMove = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.touches[0].clientY;
    if (diffY > 0) setDragY(diffY);
  };
  const handleSheetTouchEnd = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (diffY > THRESHOLD) router.push("/card/usage" as Route);
    setDragY(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.touches[0].clientY;
    if (diffY > 0) setDragY(diffY);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50 && currentCardIndex < ALL_SLIDES.length - 1) {
        handleCardChange(currentCardIndex + 1);
      } else if (diffX < -50 && currentCardIndex > 0) {
        handleCardChange(currentCardIndex - 1);
      }
    } else if (diffY > THRESHOLD) {
      router.push("/card/usage" as Route);
    }
    setDragY(0);
  };

  return (
    <div className="relative w-[375px] min-h-screen bg-white">
      <Header title="돌봄지갑 관리" onBack={() => router.push("/" as Route)} />
      {/* 카드 영역 */}
      <div
        className="absolute left-6 top-[82px] bg-[#F6F7F8]/50 rounded-[30px] pb-6 overflow-hidden"
        style={{ width: "325px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-end px-4 pt-4 h-9">
          {!isAddSlide && (
            <button
              onClick={() =>
                router.push(
                  `/card/settings?cardId=${currentCard!.cardId}` as Route,
                )
              }
              className="flex items-center gap-1 px-3 py-1 bg-hana-silver-100 rounded-xl text-xs font-medium text-black"
            >
              <Settings size={14} />
              카드 설정 변경
            </button>
          )}
        </div>

        {/* 카드 슬라이더 */}
        <div
          className="relative overflow-hidden mt-2"
          style={{ height: "165px" }}
        >
          {/* 카드 트랙 - 전체를 translateX로 이동 */}
          <div
            className="flex items-center h-full"
            style={{
              transform: `translateX(calc(${(325 - 260) / 2}px - ${currentCardIndex * (260 + 12)}px))`,
              transition: isAnimating
                ? "transform 0.35s cubic-bezier(0.22,1,0.36,1)"
                : "none",
              gap: "12px",
            }}
          >
            {ALL_SLIDES.map((slide, i) => (
              <div
                key={i}
                className="flex-shrink-0 cursor-pointer"
                style={{
                  width: "260px",
                  opacity: i === currentCardIndex ? 1 : 0.4,
                  transform:
                    i === currentCardIndex ? "scale(1)" : "scale(0.95)",
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                }}
                onClick={() => i !== currentCardIndex && handleCardChange(i)}
              >
                {slide === null ? (
                  <div
                    className="flex flex-col items-center justify-center rounded-[20px] bg-hana-green-50 border-2 border-dashed border-hana-green-700"
                    style={{ height: "165px" }}
                    onClick={() => router.push("/card/add" as Route)}
                  >
                    <div className="w-14 h-14 rounded-full bg-hana-silver-100 flex items-center justify-center">
                      <Plus size={28} color="#008485" />
                    </div>
                    <p className="text-sm font-medium text-hana-black-700 mt-3">
                      카드 추가하기
                    </p>
                  </div>
                ) : (
                  <div style={{ opacity: slide.isUse ? 1 : 0.5 }}>
                    <CardView cardNm={slide.cardNm} designCd={slide.designCd} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-3">
          {ALL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleCardChange(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentCardIndex ? "16px" : "6px",
                height: "6px",
                background: i === currentCardIndex ? "#008485" : "#D1D5DB",
              }}
            />
          ))}
        </div>

        {/* 카드 이름 & 잔액 */}
        {!isAddSlide && (
          <>
            <p className="text-center text-xl font-semibold tracking-tight text-hana-black-800 mt-3 px-6 truncate">
              {currentCard!.cardNm}
            </p>
            <div className="flex items-center justify-between px-6 mt-3">
              <div>
                <p className="text-sm text-hana-black-500">
                  {currentCard!.isUse ? "잔액" : "해지된 카드입니다"}
                </p>
                {currentCard!.isUse && (
                  <p className="text-base font-semibold tracking-tight text-hana-black-800">
                    {currentBalance.toLocaleString()}원
                  </p>
                )}
              </div>
              {currentCard!.isUse && (
                <button
                  onClick={() =>
                    router.push(
                      `/card/charge?cardId=${currentCard!.cardId}` as Route,
                    )
                  }
                  className="px-3 py-1 bg-hana-green-50 rounded-[15px] text-xs font-medium text-hana-ez-600"
                >
                  송금하기
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {/* 바텀시트 - 고정 높이, 최대 3개 노출 */}
      <div
        className="fixed w-[375px] left-1/2 -translate-x-1/2 bottom-0 bg-white rounded-t-[20px]"
        style={{
          boxShadow: "0px -4px 20px rgba(0,0,0,0.15)",
          top: "445px",
          cursor: "pointer",
        }}
        onClick={() => router.push("/card/usage" as Route)}
        onTouchStart={handleSheetTouchStart}
        onTouchMove={handleSheetTouchMove}
        onTouchEnd={handleSheetTouchEnd}
      >
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>
        <div className="px-6 mt-4">
          <p className="text-xl font-medium text-[#101828] tracking-tight">
            4월 소비 내역
          </p>
          <p className="text-2xl font-medium text-[#101828] tracking-tight mt-1">
            {monthlyTotal.toLocaleString()}원
          </p>
        </div>
        <div className="px-[34px] mt-4 overflow-hidden">
          <UsageList
            usages={filteredUsages.slice(0, 3)} // 최대 3개
            cardNm={currentCard?.cardNm ?? "카드"}
          />
        </div>
      </div>
    </div>
  );
}
