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
import type {
    AssetChartPoint,
    AssetDashboardResponse,
    FinancialAssetResponse,
    InsuranceAssetResponse
} from '../utils/types';
import {Phone} from "lucide-react";

type TabId = 'asset' | 'realestate' | 'insurance' | 'car' | 'gold';

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

const INSURANCE_CONTACTS: Record<string, string> = {
    "삼성화재": "1588-5114",
    "현대해상": "1588-5656",
    "DB손해보험": "1588-0100",
    "KB손해보험": "1544-0114",
    "한화손해보험": "1566-8000",
    "하나손해보험": "1566-3000",
    "메리츠화재": "1566-7711",
    "교보생명": "1588-1001",
    "한화생명": "1588-6363",
    "삼성생명": "1588-3114",
    "신한라이프": "1588-5580",
    "흥국화재": "1688-1688",
    "하나생명": "1688-1688",
};

const getInsurancePhone = (instNm: string) => {
    const entry = Object.entries(INSURANCE_CONTACTS).find(([name]) => instNm.includes(name));
    return entry ? entry[1] : null;
};

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
    chartData: AssetChartPoint[]; // API 연동 데이터
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

    const realAssets = useMemo(() => dashboardData?.realAssets ?? [], [dashboardData]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId as TabId);
        router.replace(`/asset?tab=${tabId}`, { scroll: false });
    };

    const summaryData = useMemo<Record<TabId, SummaryItem>>(() => {
        const getRealSum = (cate: string) =>
            (realAssets || []) // 안전하게 빈 배열 처리
                .filter(a => a.assetCateCd === cate)
                .reduce((sum, a) => sum + (a.evalAmt ?? 0), 0);

        return {
            asset: {
                type: 'total',
                amount: formatKoreanCurrency(dashboardData?.totalFinancialAmt || 0),
                buttonLabel: '자산 추가 연동하기',
                href: '/mydata/connect' as Route,
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
                    (financialAssets || [])
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
                href: '/mydata/gold?from=asset' as Route,
            },
        };
    }, [dashboardData, financialAssets, realAssets]);

    const currentSummary = summaryData[activeTab];

    const tabContent = useMemo(() => {
        switch (activeTab) {
            case 'asset': {
                const isMyDataLinked = dashboardData?.isMyDataLinked ?? false;

                if (!isMyDataLinked) {
                    return (
                        <div className="flex w-full flex-col items-center justify-center py-24 gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                    <line x1="12" y1="12" x2="12" y2="16" />
                                    <line x1="10" y1="14" x2="14" y2="14" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-[16px] text-hana-black-800">자산이 연동되지 않았어요!</p>
                                <p className="mt-1 text-[13px] text-gray-400">마이데이터를 등록하면 내 자산을 한눈에 볼 수 있어요</p>
                            </div>

                        </div>
                    );
                }

                const chartPoints = chartData.map(p => ({ name: p.month, value: p.value }));
                const values = chartPoints.map(p => p.value);
                const minVal = values.length > 0 ? Math.min(...values) : 0;
                const maxVal = values.length > 0 ? Math.max(...values) : 1;

                const domainMin = Math.max(0, Math.floor((minVal - 0.5) * 2) / 2);
                const domainMax = Math.max(domainMin + 0.5, Math.ceil((maxVal + 0.5) * 2) / 2);
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
                return realAssets.filter(a => a.assetCateCd === 'REAL_ESTATE').map((asset, index) => (
                    <AssetDetailCard
                        key={`REAL_ESTATE-${asset.realAssetId}-${index}`}
                        type="property"
                        title={asset.assetNm}
                        subtitle={parseAssetDesc('REAL_ESTATE', asset.assetDesc) || `${asset.assetSize}㎡ · ${asset.addr}`}
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        change="1,200만원"
                        changePercent="1.3%"
                        isPositive={true}
                        href={`/asset/housing/${asset.realAssetId}` as Route}
                    />
                ));
            case 'insurance':
                return (
                    <div className="mt-4 flex w-full flex-col items-center gap-6">
                        <AlertBanner
                            message="보험대리청구인을 지정하셨나요?"
                            actionText="인증하기"
                            variant="warning"
                        />

                        {insuranceAssets.length > 0 ? (
                            insuranceAssets.map((asset, index) => {
                                const phone = getInsurancePhone(asset.instNm);

                                return (
                                    <div key={`INSURANCE-WRAP-${asset.assetId}-${index}`} className="relative w-full">
                                        <AssetDetailCard
                                            type="insurance"
                                            iconType="hana-bank"
                                            company={asset.instNm}
                                            insuranceName={asset.assetNm}
                                            monthlyPremium={`월 ${formatKoreanCurrency(asset.monthlyPremAmt || 0)}`}
                                            status="normal"
                                            href={`/my/insurance/${asset.assetId}` as Route}
                                        />

                                        {phone && (
                                            <div className="mt-2 flex justify-end px-2">
                                                <a
                                                    href={`tel:${phone}`}
                                                    className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 border border-gray-100"
                                                >
                                                    <Phone size={12} className="text-hana-teal-500" />
                                                    <span>지정청구 문의  {phone}</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
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
                        subtitle={parseAssetDesc('VEHICLE', asset.assetDesc) || (asset.assetDesc ?? '')}
                        value={formatKoreanCurrency(asset.evalAmt ?? 0)}
                        change="150만원"
                        changePercent="3.2%"
                        isPositive={false}
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
                        change="80만원"
                        changePercent="6.4%"
                        isPositive={true}
                        href={`/asset/gold/${asset.realAssetId}` as Route}
                    />
                ));
            default: return null;
        }
    }, [activeTab, realAssets, financialAssets, insuranceAssets, chartData]);

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <div className="sticky top-0 z-50 bg-white">
                <TabNavigation tabs={ASSET_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
                <AssetSummaryHeader type={currentSummary.type} amount={currentSummary.amount} />
            </div>
            <main className="flex flex-col items-center gap-6 px-6 pb-24">
                {tabContent}
                {currentSummary.buttonLabel && (
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
