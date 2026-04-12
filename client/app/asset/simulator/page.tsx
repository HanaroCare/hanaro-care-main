'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/button/PrimaryButton';
import Header from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';
import { PensionCard } from '../components/simulator/PensionCard';
import SimulatorOnboarding from '../components/simulator/SimulatorOnboarding';
import { SimulatorSummaryCard } from '../components/simulator/SimulatorSummaryCard';

const ONBOARDING_KEY = 'has_seen_simulator_onboarding';
const COMPLETION_KEY = 'has_completed_simulation';

const DASHBOARD_TABS = [
  { id: 'asset', label: '자산' },
  { id: 'inheritance', label: '상속' },
];

export default function SimulatorPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasResult, setHasResult] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('asset');

  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    const completed = localStorage.getItem(COMPLETION_KEY);

    if (hasSeen === 'true') {
      setShowOnboarding(false);
    }
    if (completed === 'true') {
      setHasResult(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
  };

  if (showOnboarding) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="시뮬레이터" onBack={() => router.back()} />
        <SimulatorOnboarding onCompleteAction={handleOnboardingComplete} />
      </div>
    );
  }

  // 시뮬레이션 결과가 있고, 재계산 중이 아닐 때 요약 화면 표시
  if (hasResult && !isRecalculating) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="시뮬레이터" onBack={() => router.back()} />
        <TabNavigation
          tabs={DASHBOARD_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex flex-1 flex-col gap-8 bg-gradient-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-32">
          {activeTab === 'asset' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <h1 className="font-bold text-[22px] text-hana-black-900 leading-tight">
                  지난 시뮬레이션 결과예요
                </h1>
                <p className="font-medium text-[14px] text-hana-black-500">
                  최근에 설정한 조건으로 계산된 결과예요.
                </p>
              </div>

              <SimulatorSummaryCard />

              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-[18px] text-hana-black-900">
                  신청 가능한 연금
                </h2>
                <div className="flex flex-col gap-4">
                  <PensionCard
                    title="하나 주택연금"
                    amount="월 150만원"
                    status="13개월째 수령중"
                    onAction={() => router.push('/asset/housing')}
                  />
                  <PensionCard
                    title="하나 개인연금"
                    amount="월 80만원"
                    status="수령 예정"
                    onAction={() => console.log('개인연금 확인')}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <PrimaryButton
                  label="다시 계산하기"
                  variant="secondary"
                  onClick={handleRecalculate}
                />
                <PrimaryButton
                  label="상세 결과 보기"
                  onClick={() => router.push('/asset/simulator/result')}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="font-medium text-[16px] text-hana-black-500">
                상속 시뮬레이션은
                <br />
                준비 중입니다.
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // 입력 화면 (최초 진입 또는 재계산 클릭 시)
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        title="시뮬레이터"
        onBack={() => {
          if (hasResult) {
            setIsRecalculating(false);
          } else {
            setShowOnboarding(true);
          }
        }}
      />
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
            onClick={() => router.push('/asset/simulator/result')}
          />
        </div>
      </main>
    </div>
  );
}
