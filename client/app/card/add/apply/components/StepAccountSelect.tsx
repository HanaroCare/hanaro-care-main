"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface StepAccountSelectProps {
  value: number | null;
  onChange: (accountId: number) => void;
  onNext: () => void;
  isActive: boolean;
}

const ACCOUNTS = [
  { id: 1, label: "하나은행 123-123456-12345", balance: 1454927 },
  { id: 2, label: "국민은행 456-789012-34567", balance: 830000 },
  { id: 3, label: "신한은행 789-012345-67890", balance: 320000 },
];

export default function StepAccountSelect({
  value,
  onChange,
  onNext,
  isActive,
}: StepAccountSelectProps) {
  const [selectedAccount, setSelectedAccount] = useState(
    ACCOUNTS.find((a) => a.id === value) ?? ACCOUNTS[0],
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"충전 계좌를\n설정해주세요"}
      </h2>

      <div className="mt-6 relative">
        <button
          disabled={!isActive}
          onClick={() => {
            setShowDropdown(!showDropdown);
            setTouched(true);
          }}
          className="flex items-center justify-between w-full h-[50px] px-4 border border-[#E3E5E8] rounded-xl bg-white"
        >
          <div className="text-left">
            <p className="text-sm font-medium tracking-tight text-hana-black-600">
              {selectedAccount.label}
            </p>
          </div>
          <ChevronDown
            size={16}
            color="#E5E5E5"
            className={
              showDropdown
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
          />
        </button>

        {showDropdown && isActive && (
          <div className="absolute left-0 right-0 bg-white border border-[#E3E5E8] rounded-xl shadow-lg z-10 mt-1">
            {ACCOUNTS.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setSelectedAccount(a);
                  onChange(a.id); // 추가
                  setShowDropdown(false);
                  setTouched(true);
                }}
                className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-hana-silver-50 ${
                  selectedAccount.id === a.id ? "bg-hana-green-50" : ""
                }`}
              >
                <p className="text-sm font-medium text-hana-black-800">
                  {a.label}
                </p>
                <p className="text-sm text-hana-black-500">
                  {a.balance.toLocaleString()}원
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {isActive && (
        <button
          onClick={() => onNext()}
          disabled={!touched}
          className="mt-6 w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          다음
        </button>
      )}
    </div>
  );
}
