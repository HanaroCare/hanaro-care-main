"use client";

import { ChevronDown } from "lucide-react";

interface StepAccountSelectProps {
  onNext: () => void;
  isActive: boolean;
}

const MOCK_ACCOUNTS = [
  { id: 1, label: "하나은행 123-123456-12345" },
];

export default function StepAccountSelect({ onNext, isActive }: StepAccountSelectProps) {
  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"충전 계좌를\n설정해주세요"}
      </h2>

      <div className="mt-6">
        <div className="flex items-center justify-between w-full h-[50px] px-4 border border-[#E3E5E8] rounded-xl bg-white">
          <span className="text-sm font-medium tracking-tight text-hana-black-600">
            {MOCK_ACCOUNTS[0].label}
          </span>
          <ChevronDown size={16} color="#E5E5E5" />
        </div>
      </div>

      {isActive && (
        <button
          onClick={onNext}
          className="mt-6 w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium hover:bg-hana-green-700 transition-colors"
        >
          다음
        </button>
      )}
    </div>
  );
}