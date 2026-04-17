'use client';

import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { AssetChart } from './AssetChart';
import { AssetDetailCard } from './AssetDetailCard';
import { AssetListCard } from './AssetListCard';
import { AssetSummaryHeader } from './AssetSummaryHeader';
import { formatKoreanCurrency } from '../utils/formatCurrency';
import type { AssetChartPoint, AssetDashboardResponse, FinancialAssetResponse, InsuranceAssetResponse } from '../utils/types';

type TabId = 'asset' | 'realestate' | 'insurance' | 'car' | 'gold';

interface SummaryItem {
    type: 'total' | 'property' | 'insurance' | 'car' | 'gold';
    amount: string;
    buttonLabel: string;
    href: Route<string>;
}

const ASSET_TABS = [
    { id: 'asset', label: '자산' },
    { id: 'realestate', label: '부동산' },
    { id: 'insurance', label: '보험' },
    { id: 'car', label: '자동차' },
    { id: 'gold', label: '금' },
];

interface Props {
    dashboardData: AssetDashboardResponse | null;
    financialAssets: FinancialAssetResponse[];
    insuranceAssets: InsuranceAssetResponse[];
    chartData: AssetChartPoint[];
}

const isValidTab = (tab: string | null): tab is TabId =>
    tab !== null && ['asset', 'realestate', 'insurance', 'car', 'gold'].includes(tab);

export default function AssetPageContent({ dashboardData, financialAssets, insuranceAssets, chartData }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryTab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<TabId>('asset');

    useEffect(() => {
        if (isValidTab(queryTab)) {
            setActiveTab(queryTab);
        }
    }, [queryTab]);

    const realAssets = useMemo(
        () => dashboardData?.realAssets ?? [],
        [dashboardData],
    );

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId as TabId);
        router.replace(`/asset?tab=${tabId}`, { scroll: false });
    };

    // 상단 헤더 요약 데이터 계산
    const summaryData = useMemo<Record<TabId, SummaryItem>>(() => {
        const getRealSum = (cate: string) =>
            realAssets
                .filter(a => a.assetCateCd === cate)
                .reduce((sum, a) => sum + (a.evalAmt ?? 0), 0);

        return {
            asset: {
                type: 'total',
                amount: formatKoreanCurrency(dashboardData?.totalFinancialAmt || 0),
                buttonLabel: '노후 비용 예측하기',
                href: '/asset/simulator' as Route,
            },
            realestate: {
                type: 'property',
                amount: formatKoreanCurrency(getRealSum('REAL_ESTATE')),
                buttonLabel: '부동산 연동하기',
                href: '/mydata/house' as Route,
            },
            insurance: {
                type: 'insurance',
                amount: formatKoreanCurrency(
                    financialAssets
                        .filter(a => a.assetCateCd === 'INSURANCE')
                        .reduce((sum, a) => sum + (a.balanceAmt ?? 0), 0)
                ),
                buttonLabel: '보험 연동하기',
                href: '/mydata/connect' as Route,
            },
            car: {
                type: 'car',
                amount: formatKoreanCurrency(getRealSum('VEHICLE')),
                buttonLabel: '자동차 연동하기',
                href: '/mydata/car' as Route,
            },
            gold: {
                type: 'gold',
                amount: formatKoreanCurrency(getRealSum('GOLD')),
                buttonLabel: '금 연동하기',
                href: '/mydata/gold' as Route,
            },
        };
    }, [dashboardData, financialAssets, realAssets]);

    const currentSummary = summaryData[activeTab];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'asset': {
                const chartPoints = chartData.map(p => ({ name: p.month, value: p.value }));
                const values = chartPoints.map(p => p.value);
                const minVal = values.length > 0 ? Math.min(...values) : 0;
                const maxVal = values.length > 0 ? Math.max(...values) : 1;
                const domainMin = Math.max(0, Math.floor((minVal - 0.5) * 2) / 2);
                                const domainMax = Math.max(
                                        domainMin + 0.5,
                                        Math.ceil((maxVal + 0.5) * 2) / 2
                                    );
                                const tickCount = 5;
                                const step = (domainMax - domainMin) / (tickCount - 1);
                               const ticks = Array.from({ length: tickCount }, (_, i) =>
                                        Math.round((domainMin + step * i) * 10) / 10
                                    );
                return (
                    <>
                        <AssetListCard data={financialAssets.filter(a => a.assetCateCd !== 'INSURANCE')} />
                        {chartPoints.length > 0 && (
                            <AssetChart
                                title="6개월 자산 변화"
                                data={chartPoints}
                                config={{ type: 'bar', domain: [domainMin, domainMax], ticks }}
                            />
                        )}
                    </>
                );
            }
            case 'realestate':
                return realAssets.filter(a => a.assetCateCd === 'REAL_ESTATE').map(asset => (
                    <AssetDetailCard
                        key={asset.realAssetId}
                        type="property"
                        title={asset.assetNm}
                        subtitle={`${asset.assetSize}㎡ · ${asset.addr}`}
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        href={`/asset/housing/${asset.realAssetId}` as Route} // ID 기반 경로로 수정
                    />
                ));

            case 'insurance':
                return (
                    <div className="mt-4 flex w-full flex-col items-center gap-6">
                        <AlertBanner message="보험대리청구인으로 지정되셨나요?" actionText="인증하기" variant="warning" />
                        {insuranceAssets.length > 0 ? (
                            insuranceAssets.map(asset => (
                                <AssetDetailCard
                                    key={asset.assetId}
                                    type="insurance"
                                    iconType="hana-bank"
                                    company={asset.instNm}
                                    insuranceName={asset.assetNm}
                                    monthlyPremium={`월 ${formatKoreanCurrency(asset.monthlyPremAmt || 0)}`}
                                    status="normal"
                                    href={`/asset/insurance/${asset.assetId}` as Route} // 보험 상세 ID 경로
                                />
                            ))
                        ) : (
                            <div className="py-20 text-gray-400">등록된 보험이 없습니다.</div>
                        )}
                    </div>
                );
            case 'car':
                return realAssets.filter(a => a.assetCateCd === 'VEHICLE').map(asset => (
                    <AssetDetailCard
                        key={asset.realAssetId}
                        type="car"
                        title={asset.assetNm}
                        subtitle={asset.assetDesc || ''}
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        href={`/asset/car/${asset.realAssetId}` as Route} // ID 기반 경로로 수정
                    />
                ));
            case 'gold':
                return realAssets.filter(a => a.assetCateCd === 'GOLD').map(asset => (
                    <AssetDetailCard
                        key={asset.realAssetId}
                        type="gold"
                        title={asset.assetNm}
                        subtitle="금 현물"
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)} // RealAssetSummary 타입에 맞게 evalAmt 사용
                        href={`/asset/gold/${asset.realAssetId}` as Route} // ID 기반 경로로 수정
                    />
                ));
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <div className="sticky top-0 z-50 bg-white">
                <TabNavigation tabs={ASSET_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
                <AssetSummaryHeader type={currentSummary.type} amount={currentSummary.amount} />
            </div>
            <main className="flex flex-col items-center gap-6 px-6 pb-24">
                {renderTabContent()}
                {activeTab !== 'asset' && (
                    <div className="mt-4 w-full">
                        <PrimaryButton
                            label={currentSummary.buttonLabel}
                            onClick={() => currentSummary.href && router.push(currentSummary.href)}
                        />
                    </div>
                )}
            </main>
            <NavigationBar />
        </div>
    );
}
