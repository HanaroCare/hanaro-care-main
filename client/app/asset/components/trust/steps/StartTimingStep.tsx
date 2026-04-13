'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import TrustWizardStep from '../TrustWizardStep';

const options = [
  {
    id: 'now',
    title: '지금 바로',
    desc: ['지금부터 전문가가 굴려드려요'],
    recommended: false,
  },
  {
    id: 'when-needed',
    title: '아플때 자동으로',
    desc: ['치매 진단이나 입원시 자동 시작해요', '그 전까지는 직접 관리해요'],
    recommended: true,
  },
  {
    id: 'custom-date',
    title: '날짜를 정할게요',
    desc: ['내가 원하는 날짜에 시작해요'],
    recommended: false,
  },
];

export default function StartTimingStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <TrustWizardStep
      step={2}
      footer={
        <footer className="shrink-0 bg-white px-6 pt-10 pb-8">
          <PrimaryButton
            label="다음으로"
            disabled={!selected}
            onClick={() => router.push('/asset/trust/operation-type')}
          />
        </footer>
      }
    >
      <div className="mt-14">
        <p className="font-bold text-[22px] text-black leading-[1.45] tracking-tight">
          언제부터
          <br />
          <span className="text-hana-ez-600">시작</span>할까요?
        </p>
        <p className="mt-3 font-normal text-[#6A7282] text-sm leading-5 tracking-snug">
          지점에서 바꿀 수 있어요
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              aria-pressed={isSelected}
              className={`w-full rounded-4xl border px-4 py-5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition ${
                isSelected
                  ? 'border-hana-ez-600 bg-[#F5FFFE]'
                  : 'border-[#F2F3F5] bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[#1F2937] text-base leading-6 tracking-tight">
                    {option.title}
                  </p>
                  <div className="mt-1 flex flex-col gap-1">
                    {option.desc.map((line) => (
                      <p
                        key={line}
                        className="font-normal text-[#6A7282] text-[12px] leading-4.5 tracking-snug"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {option.recommended && (
                  <span className="shrink-0 rounded-full bg-[#E9F8F9] px-3 py-1 font-medium text-[12px] text-hana-ez-600 leading-4.5 tracking-snug">
                    추천
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </TrustWizardStep>
  );
}
