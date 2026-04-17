"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getCardAccounts, Account } from "../../../actions/card";

interface StepAccountSelectProps {
  value: number | null;
  onChange: (accountId: number) => void;
  onNext: () => void;
  isActive: boolean;
}

export default function StepAccountSelect({
  value,
  onChange,
  onNext,
  isActive,
}: StepAccountSelectProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    value,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [touched, setTouched] = useState(false);

  const selectedAccount = accounts.find(
    (a) => a.accountId === selectedAccountId,
  );

  useEffect(() => {
    getCardAccounts().then((data) => {
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].accountId);
        onChange(data[0].accountId);
        setTouched(true);
      }
    });
  }, []);

  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"충전 계좌를\n설정해주세요"}
      </h2>

      <div className="mt-6 relative">
        <button
          disabled={!isActive}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-between w-full h-[50px] px-4 border border-[#E3E5E8] rounded-xl bg-white"
        >
          <p className="text-sm font-medium tracking-tight text-hana-black-600">
            {selectedAccount
              ? `${selectedAccount.instNm} ${selectedAccount.accountNum}`
              : "계좌 선택"}
          </p>
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
            {accounts.map((a) => (
              <button
                key={a.accountId}
                onClick={() => {
                  setSelectedAccountId(a.accountId);
                  onChange(a.accountId);
                  setShowDropdown(false);
                  setTouched(true);
                }}
                className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-hana-silver-50 ${selectedAccountId === a.accountId ? "bg-hana-green-50" : ""}`}
              >
                <p className="text-sm font-medium text-hana-black-800">
                  {a.instNm} {a.accountNum}
                </p>
                <p className="text-sm text-hana-black-500">
                  {a.balanceAmt.toLocaleString()}원
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {isActive && (
        <button
          onClick={onNext}
          disabled={!touched}
          className="mt-6 w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          다음
        </button>
      )}
    </div>
  );
}
