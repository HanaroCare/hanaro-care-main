'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { AlertBanner } from '@/components/banner/AlertBanner';
import PrimaryButton from '@/components/button/PrimaryButton';
import { NavigationBar } from '@/components/NavigationBar';
import { AssetChart } from './components/AssetChart';
import { AssetDetailCard } from './components/AssetDetailCard';
import { AssetListCard } from './components/AssetListCard';
import { AssetSummaryHeader } from './components/AssetSummaryHeader';
import { AssetTabNavigation } from './components/AssetTabNavigation';

type TabId = 'asset' | 'realestate' | 'insurance' | 'car' | 'gold';

const TAB_IDS: TabId[] = ['asset', 'realestate', 'insurance', 'car', 'gold'];

function isValidTabId(tabId: string | null): tabId is TabId {
  return TAB_IDS.includes(tabId as TabId);
}

function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case 'asset':
      return (
        <>
          <AssetListCard />
          <AssetChart
            title="6개월 자산 변화"
            data={[
              { name: '7월', value: 11.8 },
              { name: '8월', value: 12.1 },
              { name: '9월', value: 11.5 },
              { name: '10월', value: 12.3 },
              { name: '11월', value: 12.6 },
              { name: '12월', value: 12.8 },
            ]}
            config={{
              type: 'bar',
              domain: [11, 13.5],
              ticks: [11, 11.5, 12, 12.5, 13],
            }}
          />
        </>
      );
    case 'realestate':
      // TODO: GET /api/asset/real?category=REAL_ESTATE 로 데이터 fetch 후 map으로 렌더링
      return (
        <>
          <AssetDetailCard
            type="property"
            title="서울 강남구 역삼동 아파트"
            subtitle="84㎡ (33평)"
            value="9억 2,000만원"
            change="1,200만원"
            changePercent="10%"
            isPositive={true}
            href="/asset/housing"
          />
          <AssetDetailCard
            type="property"
            title="경기 성남시 분당구 아파트"
            subtitle="59㎡ (25평)"
            value="5억 1,000만원"
            change="800만원"
            changePercent="5%"
            isPositive={false}
            href="/asset/housing"
          />
        </>
      );
    case 'insurance':
      // TODO: GET /api/asset/financial?category=INSURANCE 로 데이터 fetch 후 map으로 렌더링
      return (
        <div className="mt-4 flex w-full flex-col items-center gap-6">
          <AlertBanner
            message="보험대리청구인으로 지정되셨나요?"
            actionText="인증하기"
            variant="warning"
          />
          <AssetDetailCard
            type="insurance"
            iconType="hana-bank"
            company="하나생명"
            insuranceName="하나 건강보험"
            monthlyPremium="월 15만원"
            status="needs_check"
          />
          <AssetDetailCard
            type="insurance"
            iconType="hana-bank"
            company="메리츠화재"
            insuranceName="올바른 암보험"
            monthlyPremium="월 8.5만원"
            status="normal"
          />
        </div>
      );
    case 'car':
      // TODO: GET /api/asset/real?category=VEHICLE 로 데이터 fetch 후 map으로 렌더링
      return (
        <AssetDetailCard
          type="car"
          title="제네시스 GV80"
          subtitle="2022년식 · 32,000km"
          value="4,500만원"
          change="150만원"
          changePercent="3.4%"
          isPositive={false}
          href="/asset/car"
        />
      );
    case 'gold':
      // TODO: GET /api/asset/real?category=GOLD 로 데이터 fetch 후 map으로 렌더링
      return (
        <AssetDetailCard
          type="gold"
          title="골드바 (100g)"
          subtitle="중량: 100g"
          value="1,330만원"
          change="80만원"
          changePercent="10%"
          isPositive={true}
          href="/asset/gold"
        />
      );
    default:
      return null;
  }
}

function AssetPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<TabId>(
    isValidTabId(queryTab) ? queryTab : 'asset',
  );

  const handleTabChange = (tabId: string) => {
    if (isValidTabId(tabId)) {
      setActiveTab(tabId);
      router.replace(`/asset?tab=${tabId}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (isValidTabId(queryTab) && queryTab !== activeTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab, activeTab]);

  const summaryData = useMemo(
    () => ({
      asset: {
        type: 'total' as const,
        amount: '12억 8,540만원',
        buttonLabel: '자산 설계하기',
        href: '/asset/trust',
      },
      realestate: {
        type: 'property' as const,
        amount: '14억 3,000만원',
        buttonLabel: '부동산 연동하기',
        href: '/asset/housing',
      },
      insurance: {
        type: 'insurance' as const,
        amount: '-',
        buttonLabel: '보험 연동하기',
        href: '/asset/insurance',
      },
      car: {
        type: 'car' as const,
        amount: '4,500만원',
        buttonLabel: '자동차 연동하기',
        href: '/asset/car',
      },
      gold: {
        type: 'gold' as const,
        amount: '1,330만원',
        buttonLabel: '금 연동하기',
        href: '/asset/gold',
      },
    }),
    [],
  );

  const currentSummary = summaryData[activeTab];

  const handlePrimaryAction = () => {
    if (currentSummary.href) {
      router.push(currentSummary.href);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <AssetTabNavigation
          initialTab={activeTab}
          onTabChangeAction={handleTabChange}
        />
        {/* TODO: GET /api/asset 로 totalAmount fetch */}
        <AssetSummaryHeader
          type={currentSummary.type}
          amount={currentSummary.amount}
        />
      </div>
      <main className="flex flex-col items-center gap-6 px-6 pb-10">
        <TabContent activeTab={activeTab} />

        <div className="mt-4 mb-20 w-full">
          <PrimaryButton
            label={currentSummary.buttonLabel}
            onClick={handlePrimaryAction}
          />
        </div>
      </main>
      <NavigationBar />
    </div>
  );
}

export default function AssetPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AssetPageContent />
    </Suspense>
  );
}
