"use client";

import { useState } from "react";

const QUICK_NAMES = ["부동산", "의료비", "생활비"];

interface StepCardNameProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  isActive: boolean;
}

export default function StepCardName({ value, onChange, onNext, isActive }: StepCardNameProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleQuick = (name: string) => {
    setSelected(name);
    onChange(`요양보호사 ${name} 카드`);
  };

  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      {/* 알림 배너 */}
      <div className="mb-6 px-4 py-3 bg-hana-red-50 rounded-[14px]">
        <p className="text-xs font-medium text-hana-red-500">요양보호사가 여러 명이면</p>
        <p className="text-[11px] text-hana-red-500 mt-1 leading-5">
          발급 완료 후 "카드 추가하기"로 더 만들 수 있어요. 각 카드별 한도와 알림을 따로 설정 가능해요
        </p>
      </div>

      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"카드 이름을\n설정해주세요"}
      </h2>

      <div className="mt-6">
        <input
          type="text"
          value={value}
          disabled={!isActive}
          onChange={(e) => onChange(e.target.value)}
          placeholder="요양보호사 1의 카드"
          className="w-full h-[50px] px-4 border border-[#E3E5E8] rounded-xl text-sm text-hana-black-900 placeholder:text-hana-black-500 focus:outline-none focus:border-hana-green-700 disabled:bg-gray-50"
        />
      </div>

      {/* 빠른 선택 */}
      <div className="mt-4">
        <p className="text-xs text-hana-black-800 mb-2">빠른 선택</p>
        <div className="flex gap-2">
          {QUICK_NAMES.map((name) => (
            <button
              key={name}
              disabled={!isActive}
              onClick={() => handleQuick(name)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors
                ${selected === name
                  ? "bg-hana-green-700 text-white"
                  : "bg-hana-silver-100 text-hana-black-900"
                }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {isActive && (
        <button
          onClick={onNext}
          disabled={!value.trim()}
          className="mt-6 w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium hover:bg-hana-green-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
        >
          다음
        </button>
      )}
    </div>
  );
}