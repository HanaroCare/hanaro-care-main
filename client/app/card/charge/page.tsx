"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const QUICK_AMOUNTS = ["1만", "5만", "10만"];

export default function CardChargePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");

  const handleKeypad = (val: string) => {
    if (val === "delete") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + val);
    }
  };

  const handleQuick = (val: string) => {
    const num = val.replace("만", "0000");
    setAmount((prev) => String(Number(prev || "0") + Number(num)));
  };

  const formatted = amount ? Number(amount).toLocaleString() : "";

  return (
    <div className="relative min-h-screen bg-white">
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
          요양보호사1 카드로
        </p>
      </div>

      {/* 금액 표시 */}
      <div className="px-6 mt-8">
        <p className="text-[30px] font-medium tracking-tight text-hana-black-500">
          {formatted ? `${formatted}원` : "얼마를 보낼까요?"}
        </p>
      </div>

      {/* 출금 계좌 */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between w-full h-[76px] px-4 border border-[#E3E5E8] rounded-xl bg-white">
          <div>
            <p className="text-sm font-medium tracking-tight text-hana-black-500">
              하나은행 123-123456-12345
            </p>
            <p className="text-sm font-medium tracking-tight text-hana-black-800 mt-1">
              1,454,927원
            </p>
          </div>
          <ChevronLeft size={16} color="#E5E5E5" className="rotate-180" />
        </div>
      </div>

      {/* 빠른 금액 선택 */}
      <div className="flex justify-center gap-3 mt-4">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q}
            onClick={() => handleQuick(q)}
            className="px-3 py-1.5 bg-hana-silver-100 rounded-xl text-xs text-hana-black-900"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 키패드 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white">
        <div className="grid grid-cols-3">
          {["1","2","3","4","5","6","7","8","9","","0","delete"].map((key) => (
            <button
              key={key}
              onClick={() => key && handleKeypad(key)}
              className="h-[75px] flex items-center justify-center text-xl font-semibold text-hana-black-900 active:bg-hana-silver-50"
            >
              {key === "delete" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6z" stroke="#01A5AC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="#01A5AC" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              ) : key === "" ? (
                ""
              ) : (
                key
              )}
            </button>
          ))}
        </div>

        {/* 완료 버튼 */}
        <div className="px-6 pb-6 pt-2">
          <button
            disabled={!amount}
            onClick={() => router.back()}
            className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}