'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { HousingPensionStatusCard } from '../components/simulator/HousingPensionStatusCard';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';
import SimulatorOnboarding from '../components/simulator/SimulatorOnboarding';
import { SimulatorSummaryCard } from '../components/simulator/SimulatorSummaryCard';
import { TrustStatusCard } from '../components/simulator/TrustStatusCard';
import { createSimulation, getSimulationSummary } from "@/app/asset/actions/simulation";
import type { SimulationSummaryApiResponse } from '../utils/types';

const ONBOARDING_KEY = 'has_seen_simulator_onboarding';
const COMPLETION_KEY = 'has_completed_simulation';

const DASHBOARD_TABS = [
  { id: 'asset', label: '자산' },
  { id: 'inheritance', label: '상속' },
];

const CARE_METHOD_MAP: Record<string, string> = {
  'nursing-home': 'CENTER',
  'home-care': 'HOME',
  'hospital': 'HOSPITAL',
};

export default function SimulatorPage() {
  const router = useRouter();

  // 상태 관리
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [hasResult, setHasResult] = useState<boolean | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('asset');

  const [careMethod, setCareMethod] = useState('nursing-home');
  const [targetAge, setTargetAge] = useState(85);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // 시뮬레이션 요약 데이터 상태
  const [summaryData, setSummaryData] = useState<SimulationSummaryApiResponse | null>(null);

  // 데이터 로드 함수
  const loadSummary = async () => {
    try {
      setLoadError(false);
      const data = await getSimulationSummary();
      if (data) {
        setSummaryData(data);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setLoadError(true);
    }
  };

  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    const completed = localStorage.getItem(COMPLETION_KEY);

    setShowOnboarding(hasSeen !== 'true');
    setHasResult(completed === 'true');

    // 결과가 이미 있는 경우 데이터 바로 조회
    if (completed === 'true') {
      loadSummary();
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'asset') {
      router.push('/asset/simulator');
    } else if (tabId === 'inheritance') {
      const isInheritanceCompleted = localStorage.getItem('inheritance_completed') === 'true';
      router.push(isInheritanceCompleted ? '/inheritance/result' : '/inheritance/intro');
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const backendCareType = CARE_METHOD_MAP[careMethod] || 'CENTER';

      const response = await createSimulation({
        target_age: targetAge,
        care_type: backendCareType,
      });

      if (response) {
        localStorage.setItem(COMPLETION_KEY, 'true');
        localStorage.setItem('simulation_target_age', String(targetAge));
        localStorage.setItem('simulation_care_type', backendCareType);
        // 결과 페이지로 이동 전 데이터 갱신 (선택사항)
        router.push('/asset/simulator/result');
      }
    } catch (error) {
      console.error("시뮬레이션 생성 실패:", error);
      alert("미래 병원비를 계산하는 중 에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 렌더링 지연 방지
  if (showOnboarding === null) return null;

  // 1. 온보딩 화면
  if (showOnboarding) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
          <Header title="시뮬레이터" onBack={() => router.back()} />
          <SimulatorOnboarding onCompleteAction={handleOnboardingComplete} />
        </div>
    );
  }

  // 2. 결과 요약 화면 (데이터가 있을 때)
  if (hasResult && !isRecalculating) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
          <TabNavigation tabs={DASHBOARD_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="flex flex-1 flex-col gap-8 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-20">
            {activeTab === 'asset' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-bold text-[22px] text-hana-black-900 leading-tight">지난 시뮬레이션 결과예요</h1>
                    <p className="font-medium text-[14px] text-hana-black-500">최근에 설정한 조건으로 계산된 결과예요.</p>
                  </div>

                  <SimulatorSummaryCard data={summaryData} />

                  <PrimaryButton label="다시 계산하기" variant="secondary" onClick={handleRecalculate} />

                  <div className="flex flex-col gap-4">
                    <h2 className="font-bold text-[18px] text-hana-black-900">나의 신탁 현황</h2>
                    <TrustStatusCard
                        trustName="하나 케어온 신탁"
                        totalAmount="5억 2,000만원"
                        contractStatus="계약 중"
                        onAction={() => router.push('/asset/trust/dashboard')}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <h2 className="font-bold text-[18px] text-hana-black-900">부족한 병원비를 채워보러 갈까요?</h2>
                    <HousingPensionStatusCard hasPlan={false} onAction={() => router.push('/asset/housing')} />
                  </div>
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
                  <p className="font-medium text-[16px] text-hana-black-500">상속 시뮬레이션은<br />준비 중입니다.</p>
                </div>
            )}
          </main>
          <NavigationBar />
        </div>
    );
  }

  // 3. 시뮬레이션 입력 화면 (최초 진입 또는 다시 계산하기 클릭 시)
  return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="시뮬레이터" onBack={() => isRecalculating ? setIsRecalculating(false) : router.back()} />
        <main className="flex flex-1 flex-col gap-10 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-20">
          <div className="flex flex-col">
            <h1 className="page-center-text text-hana-black-900">미래 병원비 계산기</h1>
            <h2 className="page-center-text text-hana-green-700">조건을 선택해주세요</h2>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-semibold text-[16px] text-hana-black-800">몇살까지 준비할까요?</span>
            <LifeExpectancySlider value={targetAge} onChange={setTargetAge} />
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-semibold text-[16px] text-hana-black-800">원하는 요양 방식을 선택해주세요</span>
            <CareMethodSelector value={careMethod} onChange={setCareMethod} />
          </div>

          <div className="mt-auto pt-4">
            <PrimaryButton
                label={isLoading ? "AI 분석 중..." : "계산 결과 보기"}
                onClick={handleRunSimulation}
                disabled={isLoading}
            />
          </div>
        </main>
        <NavigationBar />
      </div>
  );
}
