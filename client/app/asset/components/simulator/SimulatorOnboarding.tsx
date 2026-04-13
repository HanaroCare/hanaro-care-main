'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { StepIndicator } from '@/components/baseelements/StepIndicator';
import ConsentBottomSheet from './ConsentBottomSheet';

const ONBOARDING_CONTENT = {
  title: (
    <>
      내 자산으로 <br />
      <span className="text-hana-green-700">병원비 요양비 걱정 없이</span>{' '}
      <br />살 수 있는지 알아봐요
    </>
  ),
  description:
    '아래 데이터를 자동으로 분석해서\n노후 자금이 얼마나 필요한지 계산해드려요',
};

const STEPS = [
  {
    image: '/images/asset/simulator/asset.svg',
    cardTitle: '내 금융 자산',
    dataItems: [
      '예금, 적금, 주식 등 현금화 가능한 자산',
      '연금 수령액 (국민·퇴직·개인)',
      '지자체 지원금·기초연금 수급 여부',
    ],
  },
  {
    image: '/images/asset/simulator/medical-fee.svg',
    cardTitle: '병원비 예측',
    dataItems: [
      '연령대별 평균 월 병원비 통계 적용',
      '건강보험 청구 데이터 기반 연 상승률 반영',
    ],
  },
  {
    image: '/images/asset/simulator/care-giver.svg',
    cardTitle: '요양비 예측',
    dataItems: [
      '재가 요양 월 평균 60만원',
      '노인요양시설 월 평균 120만원',
      '치매전문·프리미엄 월 150~250만원',
    ],
  },
] as const;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -20 : 20, opacity: 0 }),
};

type SimulatorOnboardingProps = {
  onCompleteAction: () => void;
};

export default function SimulatorOnboarding({
  onCompleteAction,
}: SimulatorOnboardingProps) {
  const [[currentStep, direction], setStep] = useState([0, 0]);

  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  const paginate = (newDirection: number) => {
    const nextStep = currentStep + newDirection;
    if (nextStep >= 0 && nextStep < STEPS.length) {
      setStep([nextStep, newDirection]);
    }
  };

  const currentData = STEPS[currentStep];
  const handleStartClick = () => {
    setIsConsentOpen(true); // 바로 완료하는 게 아니라 동의 창을 띄움
  };

  return (
    <div className="flex flex-1 flex-col gap-10 px-6 pt-10 pb-25">
      <header className="flex flex-col gap-4">
        <h1 className="page-center-text text-hana-black-900 leading-tight">
          {ONBOARDING_CONTENT.title}
        </h1>
        <p className="page-desc-text whitespace-pre-line text-hana-black-500">
          {ONBOARDING_CONTENT.description}
        </p>
      </header>

      {/* 카드 섹션 */}
      <section className="relative flex flex-col items-center gap-6 rounded-3xl border border-hana-silver-100 bg-white/50 p-8 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <span className="font-bold text-[12px] text-hana-black-400">
            계산에 쓰이는 데이터
          </span>
          <div className="flex items-center gap-1 font-medium text-[12px]">
            <span className="text-hana-green-700">{currentStep + 1}</span>
            <span className="text-hana-black-200">/ {STEPS.length}</span>
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center gap-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative h-32 w-32">
                <Image
                  src={currentData.image}
                  alt={currentData.cardTitle}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <h3 className="page-center-text text-hana-black-800">
                  {currentData.cardTitle}
                </h3>
                <ul className="flex flex-col gap-1">
                  {currentData.dataItems.map((item) => (
                    <li
                      key={item}
                      className="page-desc-text text-hana-black-500"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <NavButton
          direction="left"
          onClick={() => paginate(-1)}
          disabled={isFirstStep}
        />
        <NavButton
          direction="right"
          onClick={() => paginate(1)}
          disabled={isLastStep}
        />
      </section>

      <StepIndicator
        totalSteps={STEPS.length}
        currentStep={currentStep}
        idPrefix="simulator-onboarding"
      />

      <footer className="mt-auto w-full pt-4">
        <PrimaryButton
          label="미래 병원비 계산기로"
          onClick={handleStartClick}
        />
      </footer>

      <ConsentBottomSheet
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onConfirm={() => {
          setIsConsentOpen(false);
          onCompleteAction();
        }}
      />
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  if (disabled) return null;

  const isLeft = direction === 'left';
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  const positionClass = isLeft ? 'left-4' : 'right-4';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`-translate-y-1/2 absolute top-1/2 ${positionClass} z-10 rounded-full border border-hana-silver-100 bg-white p-2 text-hana-black-200 shadow-sm transition-colors hover:text-hana-green-700 active:scale-95`}
      aria-label={isLeft ? '이전 슬라이드' : '다음 슬라이드'}
    >
      <Icon size={20} />
    </button>
  );
}
