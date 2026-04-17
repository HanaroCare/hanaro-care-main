'use client';

import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { AssetChart } from './AssetChart';
import { AssetDetailCard } from './AssetDetailCard';
import { AssetListCard } from './AssetListCard';
import { AssetSummaryHeader } from './AssetSummaryHeader';
import { formatKoreanCurrency } from '../utils/formatCurrency';
import type { AssetDashboardResponse, FinancialAssetResponse, InsuranceAssetResponse } from '../utils/types';

type TabId = 'asset' | 'realestate' | 'insurance' | 'car' | 'gold';

type HousingDesc = { housing_type?: string; acquisition_year?: number };
type VehicleDesc = { brand?: string; model?: string; details?: string };

function parseAssetDesc(cateCd: 'VEHICLE' | 'REAL_ESTATE', desc: string | null | undefined): string {
    if (!desc) return '';
    try {
        const d = typeof desc === 'string' ? JSON.parse(desc) : desc;

        if (cateCd === 'VEHICLE') {
            const label = [d.brand, d.model].filter(Boolean).join(' ');
            const regDt = d.details?.split(' · ')[0] ?? '';
            return [label, regDt].filter(Boolean).join(' · ');
        }
        if (cateCd === 'REAL_ESTATE') {
            const parts: string[] = [];
            if (d.acquisition_year) parts.push(`${d.acquisition_year}년 취득`);
            if (d.housing_type) parts.push(d.housing_type);
            return parts.join(' · ');
        }
    } catch {
        return typeof desc === 'string' && !desc.includes('{') ? desc : '';
    }
    return '';
}

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
}

const isValidTab = (tab: string | null): tab is TabId =>
    tab !== null && ['asset', 'realestate', 'insurance', 'car', 'gold'].includes(tab);

export default function AssetPageContent({ dashboardData, financialAssets, insuranceAssets }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryTab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<TabId>('asset');

    useEffect(() => {
        if (isValidTab(queryTab)) {
            setActiveTab(queryTab);
        }
    }, [queryTab]);

    const realAssets = dashboardData?.realAssets || [];

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId as TabId);
        router.replace(`/asset?tab=${tabId}`, { scroll: false });
    };

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
                href: '/mydata/house?from=asset' as Route,
            },
            insurance: {
                type: 'insurance',
                amount: formatKoreanCurrency(
                    financialAssets
                        .filter(a => a.assetCateCd === 'INSURANCE')
                        .reduce((sum, a) => sum + (a.balanceAmt ?? 0), 0)
                ),
                buttonLabel: '',
                href: '' as Route,
            },
            car: {
                type: 'car',
                amount: formatKoreanCurrency(getRealSum('VEHICLE')),
                buttonLabel: '자동차 연동하기',
                href: '/mydata/car?from=asset' as Route,
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
            case 'asset':
                return (
                    <>
                        <AssetListCard data={financialAssets.filter(a => a.assetCateCd !== 'INSURANCE')} />
                        <AssetChart
                            title="6개월 자산 변화"
                            data={[
                                { name: '7월', value: 11.8 }, { name: '8월', value: 12.1 },
                                { name: '9월', value: 11.5 }, { name: '10월', value: 12.3 },
                                { name: '11월', value: 12.6 }, { name: '12월', value: 12.8 },
                            ]}
                            config={{ type: 'bar', domain: [11, 13.5], ticks: [11, 11.5, 12, 12.5, 13] }}
                        />
                    </>
                );
            case 'realestate':
                return realAssets.filter(a => a.assetCateCd === 'REAL_ESTATE').map((asset, index) => (
                    <AssetDetailCard
                        key={`REAL_ESTATE-${asset.realAssetId}-${index}`}
                        type="property"
                        title={asset.assetNm}
                        subtitle={parseAssetDesc('REAL_ESTATE', asset.assetDesc)}
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        href={`/asset/housing/${asset.realAssetId}` as Route}
                    />
                ));
            case 'insurance':
                return (
                    <div className="mt-4 flex w-full flex-col items-center gap-6">
                        <AlertBanner message="보험대리청구인으로 지정되셨나요?" actionText="인증하기" variant="warning" />
                        {insuranceAssets.length > 0 ? (
                            insuranceAssets.map((asset, index) => (
                                <AssetDetailCard
                                    key={`INSURANCE-${asset.assetId}-${index}`}
                                    type="insurance"
                                    iconType="hana-bank"
                                    company={asset.instNm}
                                    insuranceName={asset.assetNm}
                                    monthlyPremium={`월 ${formatKoreanCurrency(asset.monthlyPremAmt || 0)}`}
                                    status="normal"
                                    href={`/my/insurance/${asset.assetId}` as Route}
                                />
                            ))
                        ) : (
                            <div className="py-20 text-gray-400">등록된 보험이 없습니다.</div>
                        )}
                    </div>
                );
            case 'car':
                return realAssets.filter(a => a.assetCateCd === 'VEHICLE').map((asset, index) => (
                    <AssetDetailCard
                        key={`VEHICLE-${asset.realAssetId}-${index}`}
                        type="car"
                        title={asset.assetNm}
                        subtitle={parseAssetDesc('VEHICLE', asset.assetDesc)}
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        href={`/asset/car/${asset.realAssetId}` as Route}
                    />
                ));
            case 'gold':
                return realAssets.filter(a => a.assetCateCd === 'GOLD').map((asset, index) => (
                    <AssetDetailCard
                        key={`GOLD-${asset.realAssetId}-${index}`}
                        type="gold"
                        title={asset.assetNm}
                        subtitle="금 현물"
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        href={`/asset/gold/${asset.realAssetId}` as Route}
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
                {activeTab !== 'asset' && currentSummary.buttonLabel && (
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