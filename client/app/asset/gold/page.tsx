import { getAssetDashboard } from '@/app/asset/actions/asset';
import GoldDetailClient from './GoldDetailClient';

export default async function GoldDetailPage() {
    const dashboardData = await getAssetDashboard().catch(() => null);

    const assetData = dashboardData?.realAssets.find(
        (a) => a.assetCateCd === 'GOLD'
    ) || null;

    return <GoldDetailClient assetData={assetData} />;
}
