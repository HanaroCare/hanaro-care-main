'use client';

import { useState } from 'react';

type LifeExpectancySliderProps = {
  min?: number;
  max?: number;
  defaultAge?: number;
};

export function LifeExpectancySlider({
  min = 65,
  max = 100,
  defaultAge = 85,
}: LifeExpectancySliderProps) {
  const clamp = (val: number) => Math.min(Math.max(val, min), max);
  const [age, setAge] = useState(clamp(defaultAge));

  const range = max - min;
  const percentage = range === 0 ? 0 : ((age - min) / range) * 100;

  return (
    <div className="flex h-42.25 w-81.25 flex-col justify-between rounded-[14px] border-2 border-hana-silver-100 bg-white/80 p-6">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[16px] text-hana-black-800">
          수명 나이
        </span>
        <span className="font-bold text-[18px] text-hana-green-600">
          {age}세
        </span>
      </div>

      <div className="relative mt-2">
        <div className="relative h-3 w-full rounded-[10px] bg-hana-silver-100">
          <div
            className="absolute h-full rounded-[10px] bg-hana-green-600"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            aria-label="수명 나이 선택"
            min={min}
            max={max}
            value={age}
            onChange={(e) => setAge(clamp(Number.parseInt(e.target.value)))}
            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
          />
          <div
            className="-translate-y-1/2 pointer-events-none absolute top-1/2 z-10"
            style={{ left: `calc(${percentage}% - 22.5px)` }}
          >
            <div className="flex size-11.25 items-center justify-center rounded-full bg-hana-green-600/20">
              <div className="size-5 rounded-full bg-hana-green-600" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="font-normal text-[14px] text-hana-black-500">
            {min}세
          </span>
          <span className="font-normal text-[14px] text-hana-black-500">
            {max}세
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="font-medium text-[13px] text-hana-black-800">
          <span className="font-bold text-[17px] text-hana-green-700">
            {age}세
          </span>
          까지 노후 비용을 계산합니다
        </p>
      </div>
    </div>
  );
}
