'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NotificationButton } from './NotificationButton';
import { NotificationCardWrapper } from './NotificationCardWrapper';

type Step = {
  id: number;
  label: string;
  isActive?: boolean;
};

const steps: Step[] = [
  { id: 1, label: '자산 현황 등록' },
  { id: 2, label: '상속인 지정' },
  { id: 3, label: '신탁 연결로 계획 마무리', isActive: true },
];

export function InheritanceStepCard() {
  const router = useRouter();

  return (
    <NotificationCardWrapper
      gradientColor="#008585"
      shadowColor="rgba(0,133,133,0.08)"
    >
      <h2 className="whitespace-pre-line text-center font-bold text-[#1F2937] text-[19px] leading-[1.3] tracking-tight">
        상속 설계 3단계를{'\n'}완료해보세요
      </h2>

      <div className="mt-4 flex justify-center">
        <Image
          src="/images/asset/inheritance-recom.svg"
          alt=""
          width={80}
          height={80}
          className="h-20 w-20 object-contain"
        />
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 rounded-[15px] px-4 py-2.5 ${
              step.isActive ? 'bg-[#008585]/22' : 'bg-white'
            }`}
            style={{
              border: step.isActive ? 'none' : '1px solid #F2F3F5',
            }}
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
              {!step.isActive && (
                <Check size={12} className="text-[#008585]" strokeWidth={3} />
              )}
            </div>
            <span className="font-medium text-[#4B5563] text-[12px]">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full">
        <NotificationButton
          variant="green"
          onClick={() => router.push('/asset/trust')}
        >
          신탁 연결하러가기
        </NotificationButton>
      </div>
    </NotificationCardWrapper>
  );
}
