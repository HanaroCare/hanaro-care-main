"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import {
  getCardAccounts,
  chargeCard,
  getMyCards,
  getCardBalance,
  Account,
} from "../actions/card";
import { CardData } from "../hooks/useCard";

const QUICK_AMOUNTS = [
  { label: "1만", value: 10000 },
  { label: "5만", value: 50000 },
  { label: "10만", value: 100000 },
];

const SINGLE_LIMIT = 600000;
const CARD_BALANCE_LIMIT = 2000000;

function CardChargeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId") ?? "";

  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const [showAccountSelect, setShowAccountSelect] = useState(false);
  const [shake, setShake] = useState(false);

  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  const numericAmount = Number(amount || "0");
  const isOverLimit = numericAmount > SINGLE_LIMIT;
  const isOverCardLimit = numericAmount > 0 && currentBalance + numericAmount > CARD_BALANCE_LIMIT;
  const selectedAccount = accounts.find(
    (a) => a.accountId === selectedAccountId,
  );

  useEffect(() => {
    Promise.all([getCardAccounts(), getMyCards(), getCardBalance(cardId)]).then(
      ([accountData, cardList, balance]) => {
        setAccounts(accountData);
        if (accountData.length > 0)
          setSelectedAccountId(accountData[0].accountId);
        const found = cardList.find((c) => c.cardId === cardId) ?? null;
        setCurrentCard(found);
        setCurrentBalance(balance);
      },
    );
  }, [cardId]);

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
    if (Number(next) > SINGLE_LIMIT) {
      setAmount(next);
      triggerShake();
      return;
    }
    setAmount(next);
  };

  const handleQuick = (val: number) => {
    const next = numericAmount + val;
    setAmount(String(next));
    if (next > SINGLE_LIMIT) triggerShake();
  };

  const handleConfirm = async () => {
    if (!selectedAccountId || !amount || isOverLimit || isOverCardLimit) return;
    await chargeCard({
      cardId: cardId, // Number() 제거
      chargeAmt: numericAmount,
      accountId: selectedAccountId,
    });
    router.push(
      `/card/charge/complete?cardNm=${encodeURIComponent(selectedAccount?.instNm ?? "")}&amount=${encodeURIComponent(amount)}` as Route,
    );
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

      <Header title="카드 관리" />

      <div className="px-6 mt-8">
        <p className="text-xl font-medium text-hana-black-900 tracking-tight">
          {currentCard?.cardNm ?? "카드"}로 충전하기
        </p>
      </div>

      {/* 금액 표시 */}
      <div className="px-6 mt-6">
        <p className="text-sm text-hana-black-500 mb-2">얼마를 충전할까요?</p>
        <div
          className={`border-b-2 pb-2 ${shake ? "shake" : ""} ${isOverLimit ? "border-hana-red-500" : "border-hana-black-900"}`}
        >
          <p
            className={`text-[30px] font-medium tracking-tight ${isOverLimit ? "text-hana-red-500" : "text-hana-black-900"}`}
          >
            {formatted ? `${formatted}원` : "0원"}
          </p>
        </div>
        {isOverLimit && (
          <p className="text-xs text-hana-red-500 mt-1">
            1회 최대 {SINGLE_LIMIT.toLocaleString()}원까지 충전할 수 있어요
          </p>
        )}
        {!isOverLimit && isOverCardLimit && (
          <p className="text-xs text-hana-red-500 mt-1">
            카드 한도 200만원 이상 충전할 수 없습니다.
          </p>
        )}
      </div>

      {/* 충전 계좌 선택 */}
      <div className="px-6 mt-6 relative">
        <button
          onClick={() => setShowAccountSelect(!showAccountSelect)}
          className="flex items-center justify-between w-full h-[76px] px-4 border border-[#E3E5E8] rounded-xl bg-white"
        >
          <div className="text-left">
            <p className="text-sm font-medium tracking-tight text-hana-black-500">
              {selectedAccount
                ? `${selectedAccount.instNm} ${selectedAccount.accountNum}`
                : "계좌 선택"}
            </p>
            <p className="text-sm font-medium tracking-tight text-hana-black-800 mt-1">
              {selectedAccount
                ? `${selectedAccount.balanceAmt.toLocaleString()}원`
                : ""}
            </p>
          </div>
          <ChevronDown
            size={16}
            color="#E5E5E5"
            className={
              showAccountSelect
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
          />
        </button>

        {showAccountSelect && (
          <div className="absolute left-6 right-6 bg-white border border-[#E3E5E8] rounded-xl shadow-lg z-10 mt-1">
            {accounts.map((a) => (
              <button
                key={a.accountId}
                onClick={() => {
                  setSelectedAccountId(a.accountId);
                  setShowAccountSelect(false);
                }}
                className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-hana-silver-50 ${selectedAccountId === a.accountId ? "bg-hana-green-50" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-hana-black-800">
                    {a.instNm} {a.accountNum}
                  </p>
                </div>
                <p className="text-sm font-medium text-hana-black-800">
                  {a.balanceAmt.toLocaleString()}원
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 빠른 금액 */}
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

      {/* 키패드 */}
      <div className="mt-auto bg-hana-silver-100 pt-4">
        <div className="px-6 pb-4">
          <button
            disabled={!amount || amount === "0" || isOverLimit || isOverCardLimit}
            onClick={handleConfirm}
            className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            확인
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 px-4 pb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"].map(
            (key, i) => (
              <button
                key={i}
                onClick={() => key && handleKeypad(key)}
                className={`h-[60px] flex items-center justify-center text-xl font-semibold text-hana-black-900 rounded-xl ${key === "" ? "" : "bg-white active:bg-hana-silver-50"}`}
              >
                {key === "delete" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"
                      stroke="#01A5AC"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="18"
                      y1="9"
                      x2="12"
                      y2="15"
                      stroke="#01A5AC"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="9"
                      x2="18"
                      y2="15"
                      stroke="#01A5AC"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : key === "" ? (
                  ""
                ) : (
                  key
                )}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function CardChargePage() {
  return (
    <Suspense>
      <CardChargeContent />
    </Suspense>
  );
}
