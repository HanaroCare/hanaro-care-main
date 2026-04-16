import { Suspense } from 'react';
import AssetPageContent from './components/AssetPageContent';
import {getAssetChart, getAssetDashboard, getFinancialAssets, getInsuranceAssets} from './actions/asset';

export default async function AssetPage() {
    // 병렬 데이터 호출
    const [dashboardData, financialAssets, insuranceAssets, chartData] = await Promise.all([
        getAssetDashboard().catch(() => null),
        getFinancialAssets().catch(() => []),
        getInsuranceAssets().catch(() => []),
        getAssetChart().catch(() => []),
    ]);

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">자산 정보를 불러오는 중...</div>}>
            <AssetPageContent
                dashboardData={dashboardData}
                financialAssets={financialAssets}
                insuranceAssets={insuranceAssets}
                chartData={chartData}
            />
        </Suspense>
    );
}
