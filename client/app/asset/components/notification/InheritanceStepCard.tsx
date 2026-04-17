'use client';

import { Check } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NotificationButton } from './NotificationButton';
import { NotificationCardWrapper } from './NotificationCardWrapper';

type InheritanceStep = 1 | 2 | 3;

type StepConfig = {
  id: number;
  label: string;
};

const STEP_CONFIGS: StepConfig[] = [
  { id: 1, label: '자산 현황 등록' },
  { id: 2, label: '상속인 지정' },
  { id: 3, label: '신탁 연결로 계획 마무리' },
];

const STEP_BUTTON: Record<
  InheritanceStep,
  { label: string; href: Route<string> }
> = {
  1: { label: '자산 등록하러 가기', href: '/asset' },
  2: { label: '상속 설계하러 가기', href: '/inheritance/plan' },
  3: { label: '신탁 연결 하러가기', href: '/asset/trust' },
};

type InheritanceStepCardProps = {
  /** 현재 완료되지 않은 단계 (1: 자산 등록, 2: 상속인 지정, 3: 신탁 연결) */
  currentStep: InheritanceStep;
};

export function InheritanceStepCard({ currentStep }: InheritanceStepCardProps) {
  const router = useRouter();
  const button = STEP_BUTTON[currentStep];

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
        {STEP_CONFIGS.map((step) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-[15px] px-4 py-2.5 ${
                isActive ? 'bg-hana-green-700/10' : 'bg-white'
              }`}
              style={{
                border: isActive ? 'none' : '1px solid #F2F3F5',
              }}
            >
              <div
                className={`flex size-5 items-center justify-center rounded-full shadow-sm ${
                  isDone
                    ? 'bg-hana-green-700'
                    : 'border border-[#F2F3F5] bg-white'
                }`}
              >
                {isDone && (
                  <Check size={12} className="text-white" strokeWidth={3} />
                )}
              </div>
              <span
                className={`font-medium text-[12px] ${
                  isActive ? 'text-hana-green-700' : 'text-[#4B5563]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 w-full">
        <NotificationButton
          variant="green"
          onClick={() => router.push(button.href)}
        >
          {button.label}
        </NotificationButton>
      </div>
    </NotificationCardWrapper>
  );
}
