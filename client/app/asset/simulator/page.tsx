'use client';

import { ChevronRight, Lock } from 'lucide-react';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  getLinkedHouses,
  getPensionSimulationSummary,
  getPensionStatus,
} from '@/app/asset/actions/pension';
import {
  getFamilyTrustDetail,
  getTrustFamilyAccess,
  getTrustFamilyGrantors,
  getTrustProductSummary,
  getTrustSimulationSummary,
  type TrustAccessLevel,
  type TrustProductDetail,
  type TrustSimulationSummary,
} from '@/app/asset/actions/trust';
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

export const handleProduct = () => {
  window.location.href = 'https://m.kebhana.com/m/oqs/msoqs100.do';
};

export default function SimulatorPage() {
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [hasResult, setHasResult] = useState<boolean | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('asset');
  const [careMethod, setCareMethod] = useState('nursing-home');

  const [isParentMode, setIsParentMode] = useState(false);
  const [accessLevel, setAccessLevel] = useState<TrustAccessLevel | null>(null);
  const [grantorId, setGrantorId] = useState<number | null>(null);

  // --- 신탁 상태 ---
  const [myTrustSimulationSummary, setMyTrustSimulationSummary] =
    useState<TrustSimulationSummary | null>(null);
  const [myTrustProductSummary, setMyTrustProductSummary] =
    useState<TrustProductDetail | null>(null);
  const [isLoadingMyTrust, setIsLoadingMyTrust] = useState(false);

  // --- 주택연금 상태 추가 ---
  const [myPensionSimulationSummary, setMyPensionSimulationSummary] = useState<
    any | null
  >(null);
  const [myPensionProductSummary, setMyPensionProductSummary] = useState<
    any | null
  >(null);
  const [isLoadingPension, setIsLoadingPension] = useState(false);

  const [parentTrustDetail, setParentTrustDetail] =
    useState<TrustProductDetail | null>(null);
  const [isLoadingParentTrust, setIsLoadingParentTrust] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'asset') setActiveTab('asset');
    else if (tabId === 'inheritance') router.push('/inheritance/intro');
  };

  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    const completed = localStorage.getItem(COMPLETION_KEY);
    setShowOnboarding(hasSeen !== 'true');
    setHasResult(completed === 'true');
  }, []);

  // 가족 권한 조회
  useEffect(() => {
    getTrustFamilyAccess().then((list) => {
      if (list.some((item) => item.accessLevel === 'READ_WRITE'))
        setAccessLevel('READ_WRITE');
      else if (list.some((item) => item.accessLevel === 'PROXY_ONLY'))
        setAccessLevel('PROXY_ONLY');
      else setAccessLevel('NONE');
    });
  }, []);

  useEffect(() => {
    if (accessLevel !== 'READ_WRITE') return setGrantorId(null);
    getTrustFamilyGrantors().then((list) => {
      if (list.length > 0) setGrantorId(list[0].grantorId);
    });
  }, [accessLevel]);

  // 내 신탁 & 주택연금 데이터 Fetch
  useEffect(() => {
    const fetchMyAssetsState = async () => {
      if (!hasResult || isRecalculating) {
        setMyTrustProductSummary(null);
        setMyTrustSimulationSummary(null);
        setMyPensionProductSummary(null);
        setMyPensionSimulationSummary(null);
        return;
      }

      try {
        setIsLoadingMyTrust(true);
        setIsLoadingPension(true);

        const [trustProd, trustSim, pensionProd, linkedHouses] =
          await Promise.all([
            getTrustProductSummary(),
            getTrustSimulationSummary(),
            getPensionStatus(),
            getLinkedHouses(),
          ]);

        let pensionSim = null;

        if (linkedHouses.length > 0) {
          pensionSim = await getPensionSimulationSummary(
            linkedHouses[0].realAssetId,
          );
        }

        setMyTrustProductSummary(trustProd);
        setMyTrustSimulationSummary(trustSim);
        setMyPensionProductSummary(pensionProd);
        setMyPensionSimulationSummary(pensionSim);
      } finally {
        setIsLoadingMyTrust(false);
        setIsLoadingPension(false);
      }
    };

    fetchMyAssetsState();
  }, [hasResult, isRecalculating]);

  // 부모님 모드 데이터 Fetch
  useEffect(() => {
    const fetchParentTrustState = async () => {
      if (!isParentMode || accessLevel !== 'READ_WRITE' || !grantorId) {
        setParentTrustDetail(null);
        return;
      }
      try {
        setIsLoadingParentTrust(true);
        const detail = await getFamilyTrustDetail(grantorId);
        setParentTrustDetail(detail);
      } finally {
        setIsLoadingParentTrust(false);
      }
    };
    fetchParentTrustState();
  }, [isParentMode, accessLevel, grantorId]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleRecalculate = () => setIsRecalculating(true);

  // 상태 판별 useMemo
  const myTrustStatus = useMemo(() => {
    if (myTrustProductSummary) return 'active';
    if (myTrustSimulationSummary) return 'designed';
    return 'recommend';
  }, [myTrustProductSummary, myTrustSimulationSummary]);

  const myPensionStatus = useMemo(() => {
    if (myPensionProductSummary) return 'active';
    if (myPensionSimulationSummary) return 'designed';
    return 'recommend';
  }, [myPensionProductSummary, myPensionSimulationSummary]);

  const shouldShowParentToggle = accessLevel !== null && accessLevel !== 'NONE';
  const shouldShowMyActivePension = !isParentMode;
  const shouldShowParentProxyBanner =
    isParentMode && accessLevel === 'PROXY_ONLY';
  const shouldShowParentTrustActive =
    isParentMode && accessLevel === 'READ_WRITE';

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
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <TabNavigation
            tabs={DASHBOARD_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          {shouldShowParentToggle && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[15px] font-medium text-[#4B5563]">
                부모님 신탁 현황 확인
              </span>
              <button
                onClick={() => setIsParentMode(!isParentMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isParentMode ? 'bg-hana-ez-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isParentMode ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          )}
        </div>

        <main className="flex flex-1 flex-col gap-6 px-6 pt-8 pb-24">
          {activeTab === 'asset' ? (
            <>
              {!isParentMode && (
                <>
                  <SimulatorSummaryCard />
                  <PrimaryButton
                    label="다시 계산하기"
                    variant="secondary"
                    onClick={handleRecalculate}
                  />

                  {/* 부족 자산 채우기 추천 영역 */}
                  <div className="mt-4 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[19px] font-bold text-hana-black-900">
                        부족한 병원비를 더 채워볼까요?
                      </h2>
                      <button
                        onClick={handleProduct}
                        className="flex items-center gap-0.5 text-[12px] font-medium text-[#9CA3AF] cursor-pointer"
                      >
                        상품 더 보기 <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 내 자산 현황 섹션 */}
                  <div className="grid grid-cols-1 gap-4">
                    <ProductStatusCard
                      type="trust"
                      status={myTrustStatus}
                      isLoading={isLoadingMyTrust}
                      simulationSummary={myTrustSimulationSummary}
                      productSummary={myTrustProductSummary}
                    />
                    <ProductStatusCard
                      type="pension"
                      status={myPensionStatus}
                      isLoading={isLoadingPension}
                      pensionSimulationSummary={myPensionSimulationSummary}
                      pensionProductSummary={myPensionProductSummary}
                    />
                  </div>
                </>
              )}

              {/* 부모님 / 공통 현황 */}
              <div className="flex flex-col gap-4">
                {shouldShowParentProxyBanner && (
                  <button
                    onClick={() =>
                      router.push('/asset/trust/change-agent-child')
                    }
                    className="flex w-full flex-col items-center gap-3 rounded-[28px] border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-8"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <Lock size={22} className="text-[#9CA3AF]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[16px] font-bold text-hana-black-800">
                        신탁 현황 열람 권한이 없어요
                      </p>
                      <p className="text-[13px] text-[#9CA3AF]">
                        부모님의 자산이 안녕히 쓰이도록
                        <br />
                        열람 권한 신청을 먼저 진행해주세요.
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 rounded-full bg-[#F0F9F9] px-6 py-2.5 text-[14px] font-bold text-hana-ez-600">
                      권한 위임 신청하기
                      <ChevronRight size={16} strokeWidth={3} />
                    </div>
                  </button>
                )}

                {shouldShowParentTrustActive && (
                  <ProductStatusCard
                    type="trust"
                    status="active"
                    isLoading={isLoadingParentTrust}
                    productSummary={parentTrustDetail}
                    ownerLabel="부모님 신탁"
                    onAction={() =>
                      grantorId &&
                      router.push(
                        `/asset/trust/dashboard?grantorId=${grantorId}` as Route,
                      )
                    }
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center py-20 font-medium text-hana-black-500">
              상속 준비 중...
            </div>
          )}
        </main>
        <NavigationBar />
      </div>
    );
  }

  // 계산기 초기 진입 화면
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col gap-10 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-20">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-[24px] font-bold text-hana-black-900">
            미래 병원비 계산기
          </h1>
          <h2 className="text-[24px] font-bold text-hana-green-700">
            조건을 선택해주세요
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[16px] font-semibold text-hana-black-800">
            몇살까지 준비할까요?
          </span>
          <LifeExpectancySlider />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[16px] font-semibold text-hana-black-800">
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
