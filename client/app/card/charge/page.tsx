"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";

const CARDS = [
  { id: 1, cardNm: "김복자 요양사의 카드", accountNm: "하나은행 123-123456-12345", balance: 1454927, limitAmt: 600000 },
  { id: 2, cardNm: "한금순 요양사의 카드", accountNm: "하나은행 987-654321-98765", balance: 820000, limitAmt: 600000 },
];

const QUICK_AMOUNTS = [
  { label: "1만", value: 10000 },
  { label: "5만", value: 50000 },
  { label: "10만", value: 100000 },
];

export default function CardChargePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState(CARDS[0]);
  const [showCardSelect, setShowCardSelect] = useState(false);
  const [shake, setShake] = useState(false);
  const amountRef = useRef<HTMLDivElement>(null);

  const numericAmount = Number(amount || "0");
  const isOverLimit = numericAmount > selectedCard.limitAmt;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleKeypad = (val: string) => {
  if (val === "delete") {
    setAmount((prev) => prev.slice(0, -1));
    return;
  }
  const next = amount + val;
  if (Number(next) > selectedCard.limitAmt) {
    setAmount(next); // 일단 넣고
    triggerShake();
    return;
  }
  setAmount(next);
};

  const handleQuick = (val: number) => {
    const next = numericAmount + val;
    setAmount(String(next)); // 일단 넣고
    if (next > selectedCard.limitAmt) {
      triggerShake();
    }
  };

  const formatted = numericAmount ? numericAmount.toLocaleString() : "";

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.5s ease; }
      `}</style>

      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10 sticky top-0 bg-white z-10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 관리</span>
        <div className="w-8" />
      </div>

      {/* 카드명 */}
      <div className="px-6 mt-8">
        <p className="text-xl font-medium text-hana-black-900 tracking-tight">
          {selectedCard.cardNm}으로
        </p>
      </div>

      {/* 금액 표시 */}
      <div className="px-6 mt-6">
        <p className="text-sm text-hana-black-500 mb-2">얼마를 보낼까요?</p>
        <div
          ref={amountRef}
          className={`border-b-2 pb-2 ${shake ? "shake" : ""} ${isOverLimit ? "border-hana-red-500" : "border-hana-black-900"}`}
        >
          <p className={`text-[30px] font-medium tracking-tight ${isOverLimit ? "text-hana-red-500" : "text-hana-black-900"}`}>
            {formatted ? `${formatted}원` : "0원"}
          </p>
        </div>
        {isOverLimit && (
          <p className="text-xs text-hana-red-500 mt-1">
            현재 한도는 {selectedCard.limitAmt.toLocaleString()}원입니다
          </p>
        )}
      </div>

      {/* 출금 계좌 */}
      <div className="px-6 mt-6 relative">
        <button
          onClick={() => setShowCardSelect(!showCardSelect)}
          className="flex items-center justify-between w-full h-[76px] px-4 border border-[#E3E5E8] rounded-xl bg-white"
        >
          <div className="text-left">
            <p className="text-sm font-medium tracking-tight text-hana-black-500">
              {selectedCard.accountNm}
            </p>
            <p className="text-sm font-medium tracking-tight text-hana-black-800 mt-1">
              {selectedCard.balance.toLocaleString()}원
            </p>
          </div>
          <ChevronDown
            size={16}
            color="#E5E5E5"
            className={showCardSelect ? "rotate-180 transition-transform" : "transition-transform"}
          />
        </button>

        {showCardSelect && (
          <div className="absolute left-6 right-6 bg-white border border-[#E3E5E8] rounded-xl shadow-lg z-10 mt-1">
            {CARDS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCard(c);
                  setShowCardSelect(false);
                  setAmount("");
                }}
                className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-hana-silver-50 ${
                  selectedCard.id === c.id ? "bg-hana-green-50" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-hana-black-800">{c.cardNm}</p>
                  <p className="text-xs text-hana-black-500 mt-0.5">{c.accountNm}</p>
                </div>
                <p className="text-sm font-medium text-hana-black-800">{c.balance.toLocaleString()}원</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 빠른 금액 선택 */}
      <div className="flex justify-center gap-3 mt-4">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q.label}
            onClick={() => handleQuick(q.value)}
            className="px-3 py-1.5 bg-hana-silver-100 rounded-xl text-xs text-hana-black-900"
          >
            +{q.label}
          </button>
        ))}
      </div>

      {/* 키패드 영역 */}
      <div className="mt-auto bg-hana-silver-100 pt-4">
        {/* 확인 버튼 */}
        <div className="px-6 pb-4">
          <button
            disabled={!amount || amount === "0" || isOverLimit}
            onClick={() => router.push(`/card/charge/complete?cardNm=${selectedCard.cardNm}&amount=${amount}`)}
            className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            확인
          </button>
        </div>

        {/* 번호 키패드 */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-6">
          {["1","2","3","4","5","6","7","8","9","","0","delete"].map((key, i) => (
            <button
              key={i}
              onClick={() => key && handleKeypad(key)}
              className={`h-[60px] flex items-center justify-center text-xl font-semibold text-hana-black-900 rounded-xl ${
                key === "" ? "" : "bg-white active:bg-hana-silver-50"
              }`}
            >
              {key === "delete" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#01A5AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="18" y1="9" x2="12" y2="15" stroke="#01A5AC" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="9" x2="18" y2="15" stroke="#01A5AC" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : key === "" ? "" : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}