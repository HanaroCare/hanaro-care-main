'use client';

import { ChevronRight, Lock } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  getLinkedHouses,
  getPensionSimulationSummary,
  getPensionStatus,
  type PensionSimulationSummaryResponse,
  type PensionStatusResponse,
} from '@/app/asset/actions/pension';
import {
  createSimulation,
  getSimulationSummary,
} from '@/app/asset/actions/simulation';
import {
  getFamilyTrustDetail,
  getTrustFamilyGrantors,
  getTrustProduct,
  getTrustSimulationSummary,
  type TrustAccessLevel,
  type TrustGrantorItem,
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
import { useProductStatus } from '../hooks/useProductStatus';
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
  'nursing-hospital': 'HOSPITAL',
  premium: 'PREMIUM',
};

export default function SimulatorPage() {
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [hasResult, setHasResult] = useState<boolean | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('asset');
  const [isLoading, setIsLoading] = useState(false);

  const [careMethod, setCareMethod] = useState('home-care');
  const [targetAge, setTargetAge] = useState(85);
  const [summaryData, setSummaryData] =
    useState<SimulationSummaryApiResponse | null>(null);

  const [isParentMode, setIsParentMode] = useState(false);
  const [grantors, setGrantors] = useState<TrustGrantorItem[]>([]);
  const [grantorId, setGrantorId] = useState<string | null>(null);

  const [myTrustSimulationSummary, setMyTrustSimulationSummary] =
    useState<TrustSimulationSummary | null>(null);
  const [myTrustProductSummary, setMyTrustProductSummary] =
    useState<TrustProductDetail | null>(null);
  const [myPensionSimulationSummary, setMyPensionSimulationSummary] =
    useState<PensionSimulationSummaryResponse | null>(null);
  const [myPensionProductSummary, setMyPensionProductSummary] =
    useState<PensionStatusResponse | null>(null);
  const [myPensionRealAssetId, setMyPensionRealAssetId] = useState<
    string | null
  >(null);
  const [parentTrustDetail, setParentTrustDetail] =
    useState<TrustProductDetail | null>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    const completed = localStorage.getItem(COMPLETION_KEY);
    setShowOnboarding(hasSeen !== 'true');
    setHasResult(completed === 'true');

    getTrustFamilyGrantors()
      .then((list) => {
        setGrantors(list);
      })
      .catch((error) => {
        console.error('가족 신탁 권한 조회 실패:', error);
        setGrantors([]);
      });
  }, []);

  useEffect(() => {
    const readableGrantor = grantors.find(
      (item) => item.accessLevel === 'READ_WRITE',
    );
    setGrantorId(readableGrantor?.grantorId ?? null);
  }, [grantors]);

  useEffect(() => {
    const fetchAllAssets = async () => {
      if (!hasResult || isRecalculating) return;

      try {
        setIsLoading(true);

        const summary = await getSimulationSummary();
        setSummaryData(summary);

        const [trustProd, trustSim, pensionProd, linkedHouses] =
          await Promise.all([
            getTrustProduct(),
            getTrustSimulationSummary(),
            getPensionStatus(),
            getLinkedHouses(),
          ]);

        const pensionRealAssetId = linkedHouses[0]?.realAssetId ?? null;

        setMyPensionRealAssetId(pensionRealAssetId);

        let pensionSim = null;
        if (pensionRealAssetId) {
          pensionSim = await getPensionSimulationSummary(pensionRealAssetId);
        }

        setMyTrustProductSummary(trustProd);
        setMyTrustSimulationSummary(trustSim);
        setMyPensionProductSummary(pensionProd);
        setMyPensionSimulationSummary(pensionSim);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setMyTrustProductSummary(null);
        setMyTrustSimulationSummary(null);
        setMyPensionProductSummary(null);
        setMyPensionSimulationSummary(null);
        setMyPensionRealAssetId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAssets();
  }, [hasResult, isRecalculating]);

  useEffect(() => {
    if (isParentMode && grantorId) {
      getFamilyTrustDetail(grantorId)
        .then(setParentTrustDetail)
        .catch((error) => {
          console.error('부모 신탁 상세 조회 실패:', error);
          setParentTrustDetail(null);
        });
    } else {
      setParentTrustDetail(null);
    }
  }, [isParentMode, grantorId]);

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
        router.push('/asset/simulator/result' as Route);
      }
    } catch (error) {
      alert('계산 중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const myTrustStatus = useProductStatus(
    myTrustProductSummary,
    myTrustSimulationSummary,
  );
  const myPensionStatus = useProductStatus(
    myPensionProductSummary,
    myPensionSimulationSummary,
  );

  const parentAccessLevel = useMemo<TrustAccessLevel>(() => {
    if (grantors.some((item) => item.accessLevel === 'READ_WRITE')) {
      return 'READ_WRITE';
    }
    if (grantors.some((item) => item.accessLevel === 'PROXY_ONLY')) {
      return 'PROXY_ONLY';
    }
    return 'NONE';
  }, [grantors]);

  if (showOnboarding === null) return null;

  if (showOnboarding) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="시뮬레이터" onBack={() => router.back()} />
        <SimulatorOnboarding
          onCompleteAction={() => {
            localStorage.setItem(ONBOARDING_KEY, 'true');
            setShowOnboarding(false);
          }}
        />
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
            onTabChange={(id) => {
              setActiveTab(id);
              if (id === 'inheritance') router.push('/inheritance/intro');
            }}
          />
          {parentAccessLevel !== 'NONE' && (
            <div className="flex items-center justify-between border-b border-gray-50 px-6 py-3">
              <span className="text-[15px] font-medium text-gray-600">
                부모님 신탁 현황 확인
              </span>
              <button
                onClick={() => setIsParentMode(!isParentMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isParentMode ? 'bg-hana-ez-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isParentMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <main className="flex flex-1 flex-col gap-8 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-8 pb-24">
          {activeTab === 'asset' ? (
            <>
              {!isParentMode ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-bold text-[22px] text-hana-black-900">
                      시뮬레이션 결과예요
                    </h1>
                    <p className="text-[14px] text-hana-black-500">
                      최근 설정한 조건으로 계산된 결과예요.
                    </p>
                  </div>
                  <SimulatorSummaryCard data={summaryData} />
                  <PrimaryButton
                    label="다시 계산하기"
                    variant="third"
                    onClick={() => setIsRecalculating(true)}
                  />

                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-[18px] text-hana-black-900">
                        나의 신탁/연금 현황
                      </h2>
                      <button
                        onClick={() =>
                          (window.location.href =
                            'https://m.kebhana.com/m/oqs/msoqs100.do')
                        }
                        className="flex items-center text-[12px] text-gray-400"
                      >
                        상품 더 보기 <ChevronRight size={14} />
                      </button>
                    </div>
                    <ProductStatusCard
                      type="trust"
                      status={myTrustStatus}
                      simulationSummary={myTrustSimulationSummary}
                      productSummary={myTrustProductSummary}
                    />
                    <ProductStatusCard
                      type="pension"
                      status={myPensionStatus}
                      pensionSimulationSummary={myPensionSimulationSummary}
                      pensionProductSummary={myPensionProductSummary}
                      realAssetId={myPensionRealAssetId}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-6">
                  {parentAccessLevel === 'PROXY_ONLY' && (
                    <div className="flex flex-col items-center gap-4 rounded-[28px] border-2 border-dashed border-gray-200 bg-white p-8 text-center">
                      <Lock size={24} className="text-gray-400" />
                      <p className="font-bold text-hana-black-800">
                        신탁 현황 열람 권한이 없어요
                      </p>
                      <PrimaryButton
                        label="권한 위임 신청하기"
                        onClick={() => {
                          const proxyGrantor = grantors.find(
                            (g) => g.accessLevel === 'PROXY_ONLY',
                          );
                          const params = proxyGrantor
                            ? `?grantorId=${proxyGrantor.grantorId}&name=${encodeURIComponent(proxyGrantor.grantorName)}&relation=${encodeURIComponent(proxyGrantor.relationLabel)}`
                            : '';
                          router.push(
                            `/asset/trust/change-agent-child${params}` as Route,
                          );
                        }}
                      />
                    </div>
                  )}
                  {parentAccessLevel === 'READ_WRITE' && parentTrustDetail && (
                    <ProductStatusCard
                      type="trust"
                      status="active"
                      ownerLabel="부모님 신탁"
                      productSummary={parentTrustDetail}
                      onAction={() =>
                        grantorId
                          ? router.push(
                              `/asset/trust/dashboard?grantorId=${grantorId}` as Route,
                            )
                          : undefined
                      }
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-gray-400">
              상속 기능 준비 중...
            </div>
          )}
        </main>
        <NavigationBar />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        title="시뮬레이터"
        onBack={() =>
          isRecalculating ? setIsRecalculating(false) : router.back()
        }
      />
      <main className="flex flex-1 flex-col gap-10 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-20">
        <div className="text-center">
          <h1 className="text-[24px] font-bold text-hana-black-900">
            미래 병원비 계산기
          </h1>
          <h2 className="text-[24px] font-bold text-hana-green-700">
            조건을 선택해주세요
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-semibold text-hana-black-800">
            몇살까지 준비할까요?
          </span>
          <LifeExpectancySlider value={targetAge} onChange={setTargetAge} />
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-semibold text-hana-black-800">
            원하는 요양 방식을 선택해주세요
          </span>
          <CareMethodSelector value={careMethod} onChange={setCareMethod} />
        </div>

        <div className="mt-auto">
          <PrimaryButton
            label={isLoading ? 'AI 분석 중...' : '계산 결과 보기'}
            onClick={handleRunSimulation}
            disabled={isLoading}
          />
        </div>
      </main>
      <NavigationBar />
    </div>
  );
}
