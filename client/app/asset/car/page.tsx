import { getAssetDashboard } from '@/app/asset/actions/asset';
import CarDetailClient from './CarDetailClient';

export default async function CarDetailPage() {
    const dashboardData = await getAssetDashboard().catch(() => null);

    const assetData = dashboardData?.realAssets.find(
        (a) => a.assetCateCd === 'VEHICLE'
    ) || null;

    return <CarDetailClient assetData={assetData} />;
}
