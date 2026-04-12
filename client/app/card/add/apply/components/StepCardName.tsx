"use client";

import { useState } from "react";

const QUICK_PURPOSES = ["의료비", "간병비", "생활비"];

interface StepCardNameProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  isActive: boolean;
}

export default function StepCardName({ value, onChange, onNext, isActive }: StepCardNameProps) {
  const [name, setName] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");

  const preview = `${name ? name + " " : ""}요양보호사 ${selectedPurpose || "카드"}${selectedPurpose ? " 카드" : ""}`;

  const handleNameChange = (val: string) => {
    setName(val);
    const cardName = `${val ? val + " " : ""}요양보호사 ${selectedPurpose || "카드"}${selectedPurpose ? " 카드" : ""}`;
    onChange(cardName);
  };

  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose);
    const cardName = `${name ? name + " " : ""}요양보호사 ${purpose} 카드`;
    onChange(cardName);
  };

  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      {/* 알림 배너 */}
      <div className="mb-6 px-4 py-3 bg-hana-red-50 rounded-[14px]">
        <p className="text-xs text-hana-red-500 leading-5">
          카드별 한도와 알림을 따로 설정할 수 있어요
        </p>
      </div>

      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"카드 이름을\n설정해주세요"}
      </h2>

      {/* 이름 입력 */}
      <div className="mt-6">
        <p className="text-xs text-hana-black-800 mb-2">요양보호사 이름 (선택)</p>
        <input
          type="text"
          value={name}
          disabled={!isActive}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="예) 김말순"
          className="w-full h-[50px] px-4 border border-[#E3E5E8] rounded-xl text-sm text-hana-black-900 placeholder:text-hana-black-500 focus:outline-none focus:border-hana-green-700 disabled:bg-gray-50"
        />
      </div>

      {/* 용도 선택 */}
      <div className="mt-4">
        <p className="text-xs text-hana-black-800 mb-2">용도 선택</p>
        <div className="flex gap-2">
          {QUICK_PURPOSES.map((purpose) => (
            <button
              key={purpose}
              disabled={!isActive}
              onClick={() => handlePurposeSelect(purpose)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                selectedPurpose === purpose
                  ? "bg-hana-green-700 text-white"
                  : "bg-hana-silver-100 text-hana-black-900"
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      {/* 완성본 미리보기 */}
      <div className="mt-6 px-4 py-3 bg-hana-green-50 rounded-xl">
        <p className="text-xs text-hana-black-500 mb-1">카드 이름 미리보기</p>
        <p className="text-base font-semibold text-hana-green-700">{preview}</p>
      </div>

      {isActive && (
        <button
          onClick={onNext}
          disabled={!selectedPurpose}
          className="mt-6 w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          다음
        </button>
      )}
    </div>
  );
}