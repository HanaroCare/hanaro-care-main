'use client';

import { ChevronRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';
import { ProductStatusCard } from '../components/simulator/ProductStatusCard';
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
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [hasResult, setHasResult] = useState<boolean | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('asset');
  const [careMethod, setCareMethod] = useState('nursing-home');

  const [isParentMode, setIsParentMode] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'asset') {
      setActiveTab('asset');
    } else if (tabId === 'inheritance') {
      router.push('/inheritance/intro');
    }
  };

  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    const completed = localStorage.getItem(COMPLETION_KEY);
    setShowOnboarding(hasSeen !== 'true');
    setHasResult(completed === 'true');
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleRecalculate = () => setIsRecalculating(true);

  if (showOnboarding === null) return null;

  if (showOnboarding) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="시뮬레이터" onBack={() => router.back()} />
        <SimulatorOnboarding onCompleteAction={handleOnboardingComplete} />
      </div>
    );
  }

  if (hasResult && !isRecalculating) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* 상단 탭 및 토글 고정 영역 */}
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <TabNavigation
            tabs={DASHBOARD_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="flex items-center justify-between px-6 py-3 bg-[#F8F9FA] border-b border-[#EEE]">
            <span className="text-[14px] font-bold text-hana-black-700">
              부모님 신탁 확인하기
            </span>
            <button
              onClick={() => setIsParentMode(!isParentMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isParentMode ? 'bg-hana-ez-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${isParentMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        <main className="flex flex-1 flex-col gap-6 px-6 pt-8 pb-24">
          {activeTab === 'asset' ? (
            <>
              {/* 내 자산 모드 (토글 Off) */}
              {!isParentMode && (
                <>
                  <SimulatorSummaryCard />
                  <PrimaryButton
                    label="다시 계산하기"
                    variant="secondary"
                    onClick={handleRecalculate}
                  />

                  <div className="flex flex-col gap-5 mt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-[19px] text-hana-black-900">
                        부족한 병원비를 더 채워볼까요?
                      </h2>
                      <button
                        onClick={() => router.push('/asset/products' as any)}
                        className="text-[12px] font-medium text-[#9CA3AF] flex items-center gap-0.5"
                      >
                        상품 더 보기 <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      <ProductStatusCard type="pension" status="recommend" />
                      <ProductStatusCard type="trust" status="recommend" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <ProductStatusCard type="trust" status="designed" />
                    <ProductStatusCard type="pension" status="designed" />
                  </div>
                </>
              )}

              {/* 가입 및 운용 현황 (공통/부모 모드) */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <ProductStatusCard type="pension" status="active" />

                  {isParentMode && !hasPermission ? (
                    <button
                      type="button"
                      onClick={() =>
                        router.push('/asset/trust/change-agent-child')
                      }
                      className="w-full rounded-[28px] border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-8 flex flex-col items-center text-center gap-3 transition-all hover:border-hana-ez-600 hover:bg-[#F0F9F9]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <Lock size={22} className="text-[#9CA3AF]" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-[16px] text-hana-black-800">
                          신탁 현황 열람 권한이 없어요
                        </p>
                        <p className="text-[13px] text-[#9CA3AF]">
                          부모님의 자산이 안녕히 쓰이도록
                          <br />
                          열람 권한 신청을 먼저 진행해주세요.
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-1 rounded-full bg-[#F0F9F9] px-6 py-2.5 text-[14px] font-bold text-hana-ez-600 shadow-sm">
                        권한 위임 신청하기{' '}
                        <ChevronRight size={16} strokeWidth={3} />
                      </div>
                    </button>
                  ) : (
                    <ProductStatusCard type="trust" status="active" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center py-20 text-hana-black-500 font-medium">
              상속 준비 중...
            </div>
          )}
        </main>
        <NavigationBar />
      </div>
    );
  }

  // 입력 화면 (최초/재계산)
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col gap-10 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-20">
        <div className="flex flex-col text-center gap-1">
          <h1 className="font-bold text-[24px] text-hana-black-900">
            미래 병원비 계산기
          </h1>
          <h2 className="font-bold text-[24px] text-hana-green-700">
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
          <CareMethodSelector value={careMethod} onChange={setCareMethod} />
        </div>
        <div className="mt-auto">
          <PrimaryButton
            label="계산 결과 보기"
            onClick={() => {
              localStorage.setItem(COMPLETION_KEY, 'true');
              setHasResult(true);
              setIsRecalculating(false);
            }}
          />
        </div>
      </main>
      <NavigationBar />
    </div>
  );
}
