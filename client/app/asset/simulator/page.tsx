'use client';

import { useEffect, useState } from 'react'; // useEffect 추가
import PrimaryButton from '@/components/button/PrimaryButton';
import Header from '@/components/Header';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';
import { SimulationResultChart } from '../components/simulator/SimulationResultChart';
import SimulatorOnboarding from '../components/simulator/SimulatorOnboarding';

const STORAGE_KEY = 'has_seen_simulator_onboarding';

const MOCK_SIMULATION_DATA = [
  { age: '65세', income: 200, expense: 180 },
  { age: '70세', income: 200, expense: 180 },
  { age: '75세', income: 200, expense: 180 },
  { age: '80세', income: 200, expense: 180 },
  { age: '85세', income: 200, expense: 180 },
];

export default function SimulatorPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (hasSeen === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (!showOnboarding) {
      setShowOnboarding(true);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: showOnboarding
          ? '#ffffff'
          : 'linear-gradient(162deg, #F0FDFA 0%, #EFF6FF 28.72%, #ECFEFF 57.43%)',
      }}
    >
      <Header title="시뮬레이터" onBack={handleBack} />

      {showOnboarding ? (
        <SimulatorOnboarding onCompleteAction={handleOnboardingComplete} />
      ) : showResult ? (
        <main className="flex flex-col gap-8 px-6 pt-10 pb-25">
          <div className="flex flex-col gap-2">
            <h1 className="page-center-text text-hana-black-900">
              미래 병원비 계산 결과
            </h1>
            <p className="text-center text-[14px] text-hana-black-500">
              85세까지 약 <span className="font-bold text-hana-red-500">2억 4천만원</span>이
              <br />
              필요할 것으로 예상됩니다.
            </p>
          </div>

          <SimulationResultChart data={MOCK_SIMULATION_DATA} />

          <div className="flex flex-col gap-4 rounded-2xl bg-white/50 p-5">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-hana-black-600">준비된 자산</span>
              <span className="text-[16px] font-semibold text-hana-green-700">6억 2,000만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-hana-black-600">예상 총 지출</span>
              <span className="text-[16px] font-semibold text-hana-red-500">2억 4,000만원</span>
            </div>
            <div className="h-[1px] w-full bg-hana-black-100" />
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-hana-black-900">최종 여유 자금</span>
              <span className="text-[18px] font-bold text-hana-green-700">3억 8,000만원</span>
            </div>
          </div>

          <div className="mt-auto w-full pt-4">
            <PrimaryButton
              label="상담 신청하기"
              onClick={() => {
                /* 상담 신청 로직 */
              }}
            />
          </div>
        </main>
      ) : (
        <main className="flex flex-col gap-10 px-6 pt-10 pb-25">
          <div className="flex flex-col">
            <h1 className="page-center-text text-hana-black-900">
              미래 병원비 계산기
            </h1>
            <h2 className="page-center-text text-hana-green-700">
              조건을 선택해주세요
            </h2>
          </div>

          <div className="flex w-full flex-col gap-4">
            <span className="font-semibold text-[16px] text-hana-black-800">
              몇살까지 준비할까요?
            </span>
            <LifeExpectancySlider />
          </div>

          <div className="flex w-full flex-col gap-4 text-left">
            <span className="font-semibold text-[16px] text-hana-black-800">
              원하는 요양 방식을 선택해주세요
            </span>
            <CareMethodSelector />
          </div>

          <div className="mt-auto w-full pt-4">
            <PrimaryButton
              label="계산 결과 보기"
              onClick={() => setShowResult(true)}
            />
          </div>
        </main>
      )}
    </div>
  );
}
