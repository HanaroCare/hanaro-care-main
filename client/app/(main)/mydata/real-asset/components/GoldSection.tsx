'use client';

import { Coins, Info } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

/**
 * 금 자산 등록 및 결과 섹션
 */
export default function GoldSection({
  step,
  onComplete,
}: {
  step: string;
  onComplete: () => void;
}) {
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('24K');

  if (step === 'result') {
    return (
      <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
        <div className="mb-[2rem]">
          <h2 className="font-bold text-[1.375rem] text-foreground tracking-tight">
            금 보유 현황
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/15 to-[#FFA500]/5 p-[1.75rem] shadow-sm">
          <div className="-right-4 -bottom-4 absolute rotate-12 text-[#FFD700]/10">
            <Coins size={120} />
          </div>

          <div className="relative z-10 mb-[2.5rem] flex items-start justify-between">
            <div>
              <p className="mb-[0.375rem] font-bold text-[#B8860B] text-[0.875rem]">
                {purity} 순금
              </p>
              <h3 className="font-bold text-[1.625rem] text-foreground">
                {weight || '37.5'}g (10돈)
              </h3>
            </div>
            <div className="rounded-2xl bg-white p-[0.875rem] text-[#DAA520] shadow-sm">
              <Coins size={28} />
            </div>
          </div>

          <div className="relative z-10 space-y-[1rem]">
            <div className="flex items-center justify-between text-[0.9375rem]">
              <span className="font-medium text-muted-foreground">
                현재 금 시세(1g)
              </span>
              <span className="font-bold text-foreground">85,420원</span>
            </div>
            <div className="flex items-center justify-between border-black/5 border-t pt-[1.25rem]">
              <span className="font-bold text-hana-black-800">평가 금액</span>
              <span className="font-extrabold text-[1.5rem] text-primary">
                3,203,250원
              </span>
            </div>
          </div>
        </div>

        <div className="mt-[1.5rem] flex items-center gap-[0.5rem] rounded-[0.75rem] bg-gray-50 p-[1rem]">
          <Info size={16} className="text-muted-foreground" />
          <p className="text-[0.75rem] text-muted-foreground">
            시세는 실시간 기준이며, 거래소에 따라 다를 수 있습니다.
          </p>
        </div>

        <div className="mt-auto">
          <PrimaryButton label="확인" onClick={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
      <div className="mb-[2.5rem]">
        <h2 className="font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
          보유하신 금의
          <br />
          정보를 입력해 주세요
        </h2>
      </div>

      <div className="flex flex-col gap-[2rem]">
        <div className="flex flex-col gap-[0.75rem]">
          <label className="ml-1 font-bold text-[0.9375rem] text-hana-black-900">
            금 함량
          </label>
          <div className="grid grid-cols-3 gap-[0.625rem]">
            {['24K', '18K', '14K'].map((k) => (
              <button
                key={k}
                onClick={() => setPurity(k)}
                className={`rounded-[1rem] border py-[0.875rem] font-bold transition-all ${
                  k === purity
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[0.75rem]">
          <label className="ml-1 font-bold text-[0.9375rem] text-hana-black-900">
            중량 (g)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-[3.75rem] w-full rounded-[1rem] border border-gray-200 px-[1.25rem] pr-[3rem] text-right font-extrabold text-[1.25rem] outline-none transition-all focus:border-primary"
            />
            <span className="-translate-y-1/2 absolute top-1/2 right-[1.25rem] font-bold text-[1.125rem] text-gray-500">
              g
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <PrimaryButton
          label="시세 확인하기"
          disabled={!weight}
          onClick={onComplete}
        />
      </div>
    </div>
  );
}
