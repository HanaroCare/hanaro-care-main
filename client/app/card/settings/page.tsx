"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import CardView from "../components/CardView";
import CancelModal from "./components/CancelModal";
import Header from "@/components/navigation/Header";
import { CardData } from "../hooks/useCard";
import DayPicker from "../add/apply/components/DayPicker";

import {
  getCardAccounts,
  updateCardSettings,
  cancelCard,
  getCardById,
} from "../actions/card";

const MIN = 0;
const MAX = 2000000;
const STEP = 10000;

function CardSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId") ?? "";
  const [payDay, setPayDay] = useState<number>(15);
  const [showPicker, setShowPicker] = useState(false);

  const [limitAmt, setLimitAmt] = useState(200000);
  const [accounts, setAccounts] = useState<
    {
      accountId: number;
      instNm: string;
      accountNum: string;
      balanceAmt: number;
    }[]
  >([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const [showAccountSelect, setShowAccountSelect] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);

  const isMax = limitAmt >= MAX;
  const percent = Math.min(((limitAmt - MIN) / (MAX - MIN)) * 100, 100);
  const selectedAccount = accounts.find(
    (a) => a.accountId === selectedAccountId,
  );

  useEffect(() => {
    Promise.all([getCardAccounts(), getCardById(cardId)]).then(
      ([accountData, cardData]) => {
        setAccounts(accountData);
        if (accountData.length > 0)
          setSelectedAccountId(accountData[0].accountId);
        setCurrentCard(cardData);
        if (cardData && !cardData.isUse) setIsCancelled(true);
        if (cardData) {
          setLimitAmt(cardData.autoTransAmt);
          setPayDay(cardData.payDay ?? 15);
        }
      },
    );
  }, [cardId]);

  const handleSlider = (val: number) => {
    if (val > MAX) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
      setLimitAmt(MAX);
      return;
    }
    setLimitAmt(val);
  };

  const handleConfirm = async () => {
    if (!selectedAccountId) return;
    await updateCardSettings(cardId, {
      autoTransAmt: limitAmt,
      accountId: selectedAccountId,
      payDay: payDay,
    });
    router.back();
  };

  const handleCancel = async () => {
    await cancelCard(cardId);
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
        }
        .bounce { animation: bounce 0.4s ease; }
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #008485;
          box-shadow: 0 0 0 8px rgba(0, 168, 166, 0.25);
          cursor: pointer;
        }
      `}</style>

      <Header title="카드 관리" />

      <div
        className={`flex justify-center mt-6 transition-opacity ${isCancelled ? "opacity-40" : ""}`}
      >
        <CardView
          cardNm={currentCard?.cardNm ?? ""}
          designCd={currentCard?.designCd ?? "A"}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          disabled={isCancelled}
          onClick={() => setShowCancelModal(true)}
          className={`w-[120px] h-10 rounded-xl text-white text-sm font-semibold transition-colors ${
            isCancelled ? "bg-gray-300 cursor-default" : "bg-hana-red-500"
          }`}
        >
          {isCancelled ? "해지된 카드" : "해지하기"}
        </button>
      </div>

      <div
        className={`px-6 mt-8 flex flex-col gap-10 transition-opacity ${isCancelled ? "opacity-40 pointer-events-none" : ""}`}
      >
        {/* 충전 계좌 변경 */}
        <div>
          <p className="text-base font-medium tracking-tight text-black mb-3">
            충전 계좌를 변경해주세요
          </p>
          <div className="relative">
            <button
              onClick={() => setShowAccountSelect(!showAccountSelect)}
              className="flex items-center justify-between w-full h-[50px] px-4 border border-[#E3E5E8] rounded-xl bg-white"
            >
              <span className="text-sm font-medium tracking-tight text-hana-black-600">
                {selectedAccount
                  ? `${selectedAccount.instNm} ${selectedAccount.accountNum}`
                  : "계좌 선택"}
              </span>
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
              <div className="absolute left-0 right-0 bg-white border border-[#E3E5E8] rounded-xl shadow-lg z-10 mt-1">
                {accounts.map((a) => (
                  <button
                    key={a.accountId}
                    onClick={() => {
                      setSelectedAccountId(a.accountId);
                      setShowAccountSelect(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-hana-silver-50 ${
                      selectedAccountId === a.accountId
                        ? "bg-hana-green-50"
                        : ""
                    }`}
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
        </div>

        {/* 자동이체 금액 변경 */}
        <div>
          <p className="text-base font-medium tracking-tight text-black mb-4">
            자동이체 금액을 변경해주세요
          </p>
          <div className={bounce ? "bounce" : ""}>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-hana-black-700">
                월 자동이체 금액
              </span>
              <span className="text-xs font-medium text-hana-green-700">
                {(limitAmt / 10000).toFixed(0)}만원
              </span>
            </div>
            <div className="relative h-[14px] flex items-center">
              <div
                className="absolute h-[14px] rounded-full"
                style={{
                  width: `${percent}%`,
                  background: "rgba(13,148,136,0.8)",
                }}
              />
              <div
                className="absolute h-[14px] rounded-full right-0"
                style={{ width: `${100 - percent}%`, background: "#E5E7EB" }}
              />
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={limitAmt}
                onChange={(e) => handleSlider(Number(e.target.value))}
                className="relative w-full appearance-none bg-transparent cursor-pointer slider-thumb"
              />
            </div>
            <p className="text-xs text-hana-green-700 mt-2 font-medium">
              {isMax
                ? "월 200만원까지 충전할 수 있어요"
                : `현재 ${(limitAmt / 10000).toFixed(0)}만원`}
            </p>
          </div>
        </div>

        {/* 자동이체일 변경 */}
        <div>
          <p className="text-base font-medium tracking-tight text-black mb-3">
            자동이체일을 설정해주세요
          </p>
          <div className="flex items-center justify-between px-4 h-[50px] border border-[#E3E5E8] rounded-xl bg-white">
            <span className="text-sm font-medium text-hana-black-600">
              매월 {payDay}일
            </span>
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="text-sm font-medium text-hana-green-700"
            >
              변경
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-10">
        <button
          disabled={isCancelled}
          onClick={handleConfirm}
          className="w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          {isCancelled ? "해지된 카드입니다." : "변경 완료"}
        </button>
      </div>

      {/* DayPicker 바텀시트 */}
      {showPicker && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="bg-white rounded-t-[20px] w-full max-w-[375px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-center mb-4">
              자동이체일 선택
            </p>
            <DayPicker
              value={payDay}
              onChange={(day) => setPayDay(day)}
              disabled={false}
            />
            <button
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {showCancelModal && (
        <CancelModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}

export default function CardSettingsPage() {
  return (
    <Suspense>
      <CardSettingsContent />
    </Suspense>
  );
}
