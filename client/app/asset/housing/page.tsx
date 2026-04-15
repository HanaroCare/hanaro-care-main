import { getAssetDashboard } from '@/app/asset/actions/asset';
import HousingDetailClient from './HousingDetailClient';

export default async function HousingDetailPage() {
    const dashboardData = await getAssetDashboard().catch(() => null);

    const assetData = dashboardData?.realAssets.find(
        (a) => a.assetCateCd === 'REAL_ESTATE'
    ) || null;

    return <HousingDetailClient assetData={assetData} />;
}
