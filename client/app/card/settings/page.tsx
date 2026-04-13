"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";
import CardView from "../components/CardView";
import CancelModal from "./components/CancelModal";

const MIN = 100000;
const MAX = 600000;
const STEP = 10000;

const ACCOUNTS = [
  { id: 1, label: "하나은행 123-123456-12345", balance: 1454927 },
  { id: 2, label: "국민은행 456-789012-34567", balance: 830000 },
  { id: 3, label: "신한은행 789-012345-67890", balance: 320000 },
];

const INITIAL_LIMIT = 300000;
const INITIAL_ACCOUNT_ID = 1;

export default function CardSettingsPage() {
  const router = useRouter();
  const [limitAmt, setLimitAmt] = useState(INITIAL_LIMIT);
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [showAccountSelect, setShowAccountSelect] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const isChanged =
    limitAmt !== INITIAL_LIMIT || selectedAccount.id !== INITIAL_ACCOUNT_ID;
  const isMax = limitAmt >= MAX;
  const percent = Math.min(((limitAmt - MIN) / (MAX - MIN)) * 100, 100);

  const handleSlider = (val: number) => {
    if (val > MAX) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
      setLimitAmt(MAX);
      return;
    }
    setLimitAmt(val);
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  return (
    <div className="relative min-h-screen bg-white">
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

      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10 sticky top-0 bg-white z-10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">
          카드 관리
        </span>
        <div className="w-8" />
      </div>

      {/* 카드 미리보기 */}
      <div
        className={`flex justify-center mt-6 transition-opacity ${isCancelled ? "opacity-40" : ""}`}
      >
        <CardView cardNm="김복자 요양사의 카드" />
      </div>

      {/* 해지하기 버튼 */}
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

      {/* 설정 섹션 */}
      <div
        className={`px-6 mt-8 flex flex-col gap-10 transition-opacity ${isCancelled ? "opacity-40 pointer-events-none" : ""}`}
      >
        {/* 월 충전 한도 변경 */}
        <div>
          <p className="text-base font-medium tracking-tight text-black mb-4">
            월 충전 한도를 변경해주세요
          </p>
          <div className={bounce ? "bounce" : ""}>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-hana-black-700">
                월 충전 한도
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
                style={{
                  width: `${100 - percent}%`,
                  background: "#E5E7EB",
                }}
              />
              <input
                id="limit-slider"
                aria-label="월 충전 한도"
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={limitAmt}
                onChange={(e) => handleSlider(Number(e.target.value))}
                className="relative w-full appearance-none bg-transparent cursor-pointer slider-thumb"
              />
            </div>
            {isMax ? (
              <p className="text-xs text-hana-green-700 mt-2 font-medium">
                월 60만원까지 충전할 수 있어요
              </p>
            ) : (
              <p className="text-xs text-hana-green-700 mt-2 font-medium">
                현재 {(limitAmt / 10000).toFixed(0)}만원
              </p>
            )}
          </div>
        </div>

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
                {selectedAccount.label}
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
                {ACCOUNTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelectedAccount(a);
                      setShowAccountSelect(false);
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
        </div>
      </div>

      {/* 변경 완료 버튼 */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <button
          disabled={!isChanged || isCancelled}
          onClick={() => router.back()}
          className="w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          {isCancelled ? "해지된 카드입니다." : "변경 완료"}
        </button>
      </div>

      {/* 해지 확인 모달 */}
      {showCancelModal && (
        <CancelModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}
