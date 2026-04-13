"use client";

import { useState } from "react";

const CARD_DESIGNS = [
  { id: 1, src: "/images/card/careCard_1.png" },
  { id: 2, src: "/images/card/careCard_2.png" },
  { id: 3, src: "/images/card/careCard_3.png" },
  { id: 4, src: "/images/card/careCard_4.png" },
  { id: 5, src: "/images/card/careCard_5.png" },
];

interface CardIssueScreenProps {
  onIssue: (designId: number) => void;
}

export default function CardIssueScreen({ onIssue }: CardIssueScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const prev = (currentIndex - 1 + CARD_DESIGNS.length) % CARD_DESIGNS.length;
  const next = (currentIndex + 1) % CARD_DESIGNS.length;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const [dragX, setDragX] = useState(0);

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = touchStartX - e.touches[0].clientX;
    setDragX(-diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) setCurrentIndex(next);
    else if (diff < -50) setCurrentIndex(prev);
    setDragX(0);
  };

  return (
    <div className="relative w-full min-h-[812px] bg-white">
      <style>{`
        .card-item {
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

      {/* 상단 레이블 */}
      <div className="absolute left-6 top-[140px]">
        <p className="text-xs text-[#6A7282]">요양보호사 선불카드</p>
      </div>

      {/* 타이틀 */}
      <div className="absolute left-6 top-[162px]">
        <h1 className="text-xl font-semibold leading-[30px] tracking-tight text-black">
          어떤 디자인으로 발급할까요?
        </h1>
      </div>

      {/* 카드 슬라이더 */}
      <div
        className="absolute w-full top-[260px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {/* 인디케이터 - 카드 위 */}
        <div className="flex justify-center gap-1.5 mb-3">
          {CARD_DESIGNS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? "16px" : "6px",
                height: "6px",
                background: i === currentIndex ? "#008485" : "#D1D5DB",
              }}
            />
          ))}
        </div>

        {/* 카드 영역 - overflow hidden으로 양옆 잘림 처리 */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ height: "185px" }}
        >
          {/* 왼쪽 카드 */}
          <div
            className="card-item absolute cursor-pointer"
            style={{
              left: "-40px",
              width: "210px",
              opacity: 0.6,
              transform: "scale(0.8)",
              zIndex: 1,
            }}
            onClick={() => setCurrentIndex(prev)}
          >
            <img
              src={CARD_DESIGNS[prev].src}
              alt={`카드 디자인 ${prev + 1}`}
              className="w-full rounded-xl object-cover shadow-md"
              style={{ height: "132px" }}
            />
          </div>

          {/* 가운데 카드 */}
          <div
            className="card-item relative"
            style={{
              width: "262px",
              zIndex: 10,
              transform: `translateX(${dragX * 0.3}px)`,
            }}
          >
            <img
              src={CARD_DESIGNS[currentIndex].src}
              alt={`카드 디자인 ${currentIndex + 1}`}
              className="w-full rounded-xl object-cover shadow-xl"
              style={{ height: "165px" }}
            />
          </div>

          {/* 오른쪽 카드 */}
          <div
            className="card-item absolute cursor-pointer"
            style={{
              right: "-40px",
              width: "210px",
              opacity: 0.6,
              transform: "scale(0.8)",
              zIndex: 1,
            }}
            onClick={() => setCurrentIndex(next)}
          >
            <img
              src={CARD_DESIGNS[next].src}
              alt={`카드 디자인 ${next + 1}`}
              className="w-full rounded-xl object-cover shadow-md"
              style={{ height: "132px" }}
            />
          </div>
        </div>
      </div>

      {/* 카드 설명 */}
      <div className="absolute w-full text-center top-[482px]">
        <p className="text-xl font-semibold tracking-tight text-black">
          하나은행 요양보호사 전용 선불카드
        </p>
        <p className="text-xs text-[#4A5565] mt-2 tracking-tight">
          선불 충전 방식으로 이상 지출을 실시간으로 감지해요
        </p>
      </div>

      {/* 발급 버튼 */}
      <button
        onClick={() => onIssue(CARD_DESIGNS[currentIndex].id)}
        className="absolute h-[53px] rounded-xl text-white text-base font-medium bg-hana-ez-600 hover:bg-hana-green-700 transition-colors"
        style={{
          width: "327px",
          left: "calc(50% - 327px/2 + 1px)",
          top: "585px",
        }}
      >
        이 디자인이 좋아요
      </button>
    </div>
  );
}
