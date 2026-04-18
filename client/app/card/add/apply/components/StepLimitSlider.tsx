"use client";

import { useEffect, useState } from "react";
import DayPicker from "./DayPicker";

interface StepLimitSliderProps {
  value: number;
  onChange: (val: number) => void;
  onNext: () => void;
  isActive: boolean;
  onPayDayChange: (day: number) => void;
}

const MIN = 0;
const MAX = 2000000;
const STEP = 10000;

export default function StepLimitSlider({
  value,
  onChange,
  onNext,
  isActive,
  onPayDayChange,
}: StepLimitSliderProps) {
  const [touched, setTouched] = useState(false);
  const [bounce, setBounce] = useState(false);

  const isMax = value >= MAX;
  const percent = Math.min(((value - MIN) / (MAX - MIN)) * 100, 100);
  const [payDay, setPayDay] = useState<number | null>(15);

  useEffect(() => {
    onPayDayChange(15);
  }, []);

  const handleChange = (val: number) => {
    if (val > MAX) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
      onChange(MAX);
      return;
    }
    setTouched(true);
    onChange(val);
  };

  return (
    <div className="page-in px-8 pt-8 pb-6">
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

      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"자동이체 금액을\n정해주세요"}
      </h2>

      <div className={`mt-8 ${bounce ? "bounce" : ""}`}>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-hana-black-700">
            월 자동이체 금액
          </span>
          <span className="text-sm font-medium text-hana-green-700">
            {(value / 10000).toFixed(0)}만원
          </span>
        </div>

        {/* 슬라이더 */}
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
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={value}
            disabled={!isActive}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="relative w-full appearance-none bg-transparent cursor-pointer disabled:cursor-default slider-thumb touch-none"
          />
        </div>

        {isMax ? (
          <p className="text-xs text-hana-green-700 mt-2 font-medium">
            월 200만원까지 채울 수 있어요
          </p>
        ) : (
          <p className="text-xs text-hana-green-700 mt-2 font-medium">
            현재 {(value / 10000).toFixed(0)}만원
          </p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-hana-black-700 mb-3">
          자동이체일
        </p>
        <DayPicker
          value={payDay}
          onChange={(day) => {
            setPayDay(day);
            onPayDayChange(day);
          }}
          disabled={!isActive}
        />
      </div>

      {isActive && (
        <button
          onClick={async () => {
            await onNext();
          }}
          disabled={false}
          className="mt-6 w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          다음
        </button>
      )}
    </div>
  );
}
