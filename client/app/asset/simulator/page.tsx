'use client';

import { useRouter } from 'next/navigation'; // 추가
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/button/PrimaryButton';
import Header from '@/components/Header';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';
import SimulatorOnboarding from '../components/simulator/SimulatorOnboarding';

const STORAGE_KEY = 'has_seen_simulator_onboarding';

export default function SimulatorPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);

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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        title="시뮬레이터"
        onBack={() =>
          showOnboarding ? router.back() : setShowOnboarding(true)
        }
      />

      {showOnboarding ? (
        <SimulatorOnboarding onCompleteAction={handleOnboardingComplete} />
      ) : (
        <main className="flex flex-1 flex-col gap-10 bg-gradient-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-25">
          <div className="flex flex-col">
            <h1 className="page-center-text text-hana-black-900">
              미래 병원비 계산기
            </h1>
            <h2 className="page-center-text text-hana-green-700">
              조건을 선택해주세요
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-semibold text-[16px] text-hana-black-800">
              몇살까지 준비할까요?
            </span>
            <LifeExpectancySlider />
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-semibold text-[16px] text-hana-black-800">
              원하는 요양 방식을 선택해주세요
            </span>
            <CareMethodSelector />
          </div>

          <div className="mt-auto pt-4">
            <PrimaryButton
              label="계산 결과 보기"
              onClick={() => router.push('/asset/simulator/result')} // 경로 이동
            />
          </div>
        </main>
      )}
    </div>
  );
}
