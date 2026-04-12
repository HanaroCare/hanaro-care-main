"use client";

interface StepLimitSliderProps {
  value: number;
  onChange: (val: number) => void;
  onNext: () => void;
  isActive: boolean;
}

const MIN = 100000;
const MAX = 2000000;
const STEP = 100000;

export default function StepLimitSlider({ value, onChange, onNext, isActive }: StepLimitSliderProps) {
  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="page-in px-8 pt-8 pb-6">
      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"월 충전 한도를\n정해주세요"}
      </h2>

      <div className="mt-8 relative">
        {/* 슬라이더 값 표시 */}
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-hana-black-700">월 충전 한도</span>
          <span className="text-sm font-medium text-hana-green-700">
            {(value / 10000).toFixed(0)}만원
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative h-[14px] flex items-center">
          <div
            className="absolute h-[14px] rounded-full w-full"
            style={{
              background: `linear-gradient(90deg, rgba(13,148,136,0.8) 0%, rgba(13,148,136,0.8) ${percent}%, #E5E7EB ${percent}%, #E5E7EB 100%)`,
            }}
          />
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={value}
            disabled={!isActive}
            onChange={(e) => onChange(Number(e.target.value))}
            className="relative w-full appearance-none bg-transparent cursor-pointer disabled:cursor-default
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-[20px]
              [&::-webkit-slider-thumb]:h-[20px]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-hana-green-700
              [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-xs text-hana-black-500">{(MIN / 10000).toFixed(0)}만원</span>
          <span className="text-xs text-hana-black-500">{(MAX / 10000).toFixed(0)}만원</span>
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