'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import type { Route } from 'next';

// Actions 통합 임포트
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
import { 
  createSimulation, 
  getSimulationSummary 
} from "@/app/asset/actions/simulation";

// 컴포넌트 임포트
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { HousingPensionStatusCard } from '../components/simulator/HousingPensionStatusCard';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';
import SimulatorOnboarding from '../components/simulator/SimulatorOnboarding';
import { SimulatorSummaryCard } from '../components/simulator/SimulatorSummaryCard';
import { ProductStatusCard } from '../components/simulator/ProductStatusCard';
import type { SimulationSummaryApiResponse } from '../utils/types';

const ONBOARDING_KEY = 'has_seen_simulator_onboarding';
const COMPLETION_KEY = 'has_completed_simulation';
const DASHBOARD_TABS = [{ id: 'asset', label: '자산' }, { id: 'inheritance', label: '상속' }];

const CARE_METHOD_MAP: Record<string, string> = {
  'nursing-home': 'CENTER',
  'home-care': 'HOME',
  'nursing-hospital': 'HOSPITAL',
  'premium': 'PREMIUM',
};

export default function SimulatorPage() {
  const router = useRouter();

  // 1. 공통 및 온보딩 상태
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [hasResult, setHasResult] = useState<boolean | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('asset');
  const [isLoading, setIsLoading] = useState(false);

  // 2. 시뮬레이션 입력값 상태
  const [careMethod, setCareMethod] = useState('home-care');
  const [targetAge, setTargetAge] = useState(85);
  const [summaryData, setSummaryData] = useState<SimulationSummaryApiResponse | null>(null);

  // 3. 자산 현황 상세 데이터 상태 (신탁 & 주택연금)
  const [isParentMode, setIsParentMode] = useState(false);
  const [accessLevel, setAccessLevel] = useState<TrustAccessLevel | null>(null);
  const [grantorId, setGrantorId] = useState<number | null>(null);

  const [myTrustSimulationSummary, setMyTrustSimulationSummary] = useState<TrustSimulationSummary | null>(null);
  const [myTrustProductSummary, setMyTrustProductSummary] = useState<TrustProductDetail | null>(null);
  const [myPensionSimulationSummary, setMyPensionSimulationSummary] = useState<any | null>(null);
  const [myPensionProductSummary, setMyPensionProductSummary] = useState<any | null>(null);
  const [parentTrustDetail, setParentTrustDetail] = useState<TrustProductDetail | null>(null);

  // 초기 설정 및 권한 체크
  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDING_KEY);
    const completed = localStorage.getItem(COMPLETION_KEY);
    setShowOnboarding(hasSeen !== 'true');
    setHasResult(completed === 'true');

    // 가족 권한 체크
    getTrustFamilyAccess().then((list) => {
      if (list.some((item) => item.accessLevel === 'READ_WRITE')) setAccessLevel('READ_WRITE');
      else if (list.some((item) => item.accessLevel === 'PROXY_ONLY')) setAccessLevel('PROXY_ONLY');
      else setAccessLevel('NONE');
    });
  }, []);

  // 위임자 정보 로드
  useEffect(() => {
    if (accessLevel === 'READ_WRITE') {
      getTrustFamilyGrantors().then((list) => {
        if (list.length > 0) setGrantorId(list[0].grantorId);
      });
    }
  }, [accessLevel]);

  // 자산 현황 통합 로드 (결과가 있을 때만)
  useEffect(() => {
    const fetchAllAssets = async () => {
      if (!hasResult || isRecalculating) return;

      try {
        setIsLoading(true);
        // 1. AI 시뮬레이션 요약 정보
        const summary = await getSimulationSummary();
        setSummaryData(summary);

        // 2. 신탁 및 주택연금 상세 현황 (병렬 호출)
        const [trustProd, trustSim, pensionProd, linkedHouses] = await Promise.all([
          getTrustProductSummary(),
          getTrustSimulationSummary(),
          getPensionStatus(),
          getLinkedHouses(),
        ]);

        let pensionSim = null;
        if (linkedHouses && linkedHouses.length > 0) {
          pensionSim = await getPensionSimulationSummary(linkedHouses[0].realAssetId);
        }

        setMyTrustProductSummary(trustProd);
        setMyTrustSimulationSummary(trustSim);
        setMyPensionProductSummary(pensionProd);
        setMyPensionSimulationSummary(pensionSim);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAssets();
  }, [hasResult, isRecalculating]);

  // 부모님 신탁 상세 로드
  useEffect(() => {
    if (isParentMode && accessLevel === 'READ_WRITE' && grantorId) {
      getFamilyTrustDetail(grantorId).then(setParentTrustDetail);
    }
  }, [isParentMode, accessLevel, grantorId]);

  // 시뮬레이션 실행 로직
  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const backendCareType = CARE_METHOD_MAP[careMethod] || 'CENTER';
      const response = await createSimulation({ target_age: targetAge, care_type: backendCareType });
      if (response) {
        localStorage.setItem(COMPLETION_KEY, 'true');
        setHasResult(true);
        setIsRecalculating(false);
        // 결과 페이지로 이동하거나 현재 페이지에서 결과 렌더링
        router.push('/asset/simulator/result' as Route);
      }
    } catch (error) {
      alert("계산 중 에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (showOnboarding === null) return null;

  // 1. 온보딩 화면
  if (showOnboarding) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header title="시뮬레이터" onBack={() => router.back()} />
        <SimulatorOnboarding onCompleteAction={() => {
          localStorage.setItem(ONBOARDING_KEY, 'true');
          setShowOnboarding(false);
        }} />
      </div>
    );
  }

  // 2. 결과 대시보드 화면
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
          {accessLevel && accessLevel !== 'NONE' && (
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-50">
              <span className="text-[15px] font-medium text-gray-600">부모님 신탁 현황 확인</span>
              <button
                onClick={() => setIsParentMode(!isParentMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isParentMode ? 'bg-hana-ez-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isParentMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}
        </div>

        <main className="flex flex-1 flex-col gap-8 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-8 pb-24">
          {activeTab === 'asset' ? (
            <>
              {!isParentMode ? (
                <>
                  {/* 시뮬레이션 요약 카드 */}
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-bold text-[22px] text-hana-black-900">시뮬레이션 결과예요</h1>
                    <p className="text-[14px] text-hana-black-500">최근 설정한 조건으로 계산된 결과예요.</p>
                  </div>
                  <SimulatorSummaryCard data={summaryData} />
                  <PrimaryButton label="다시 계산하기" variant="secondary" onClick={() => setIsRecalculating(true)} />

                  {/* 나의 자산 현황 (신탁/연금) */}
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-[18px] text-hana-black-900">나의 신탁/연금 현황</h2>
                      <button onClick={() => window.location.href = 'https://m.kebhana.com/m/oqs/msoqs100.do'} className="flex items-center text-[12px] text-gray-400">
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
                    />
                  </div>
                </>
              ) : (
                /* 부모님 모드 */
                <div className="flex flex-col gap-6">
                  {accessLevel === 'PROXY_ONLY' && (
                    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-[28px] border-2 border-dashed border-gray-200 text-center">
                      <Lock size={24} className="text-gray-400" />
                      <p className="font-bold text-hana-black-800">신탁 현황 열람 권한이 없어요</p>
                      <PrimaryButton label="권한 위임 신청하기" onClick={() => router.push('/asset/trust/change-agent-child')} />
                    </div>
                  )}
                  {accessLevel === 'READ_WRITE' && (
                    <ProductStatusCard 
                      type="trust" 
                      status="active" 
                      ownerLabel="부모님 신탁" 
                      productSummary={parentTrustDetail}
                      onAction={() => grantorId && router.push(`/asset/trust/dashboard?grantorId=${grantorId}` as Route)} 
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-gray-400">상속 기능 준비 중...</div>
          )}
        </main>
        <NavigationBar />
      </div>
    );
  }

  // 3. 시뮬레이터 입력 화면 (초기 진입 또는 다시 계산)
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="시뮬레이터" onBack={() => isRecalculating ? setIsRecalculating(false) : router.back()} />
      <main className="flex flex-1 flex-col gap-10 bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF] px-6 pt-10 pb-20">
        <div className="text-center">
          <h1 className="text-[24px] font-bold text-hana-black-900">미래 병원비 계산기</h1>
          <h2 className="text-[24px] font-bold text-hana-green-700">조건을 선택해주세요</h2>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-semibold text-hana-black-800">몇살까지 준비할까요?</span>
          <LifeExpectancySlider value={targetAge} onChange={setTargetAge} />
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-semibold text-hana-black-800">원하는 요양 방식을 선택해주세요</span>
          <CareMethodSelector value={careMethod} onChange={setCareMethod} />
        </div>

        <div className="mt-auto">
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