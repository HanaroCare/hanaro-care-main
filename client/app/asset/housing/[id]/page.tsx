import { getRealAssetDetail } from '@/app/asset/actions/asset';
import HousingDetailClient from "@/app/asset/housing/[id]/HousingDetailClient";

interface Props {
    params: Promise<{ id: string }>; // params를 Promise로 선언
}

export default async function HousingDetailPage({ params }: Props) {
    const { id } = await params;

    console.log("Fetching Housing ID:", id);
    const assetData = await getRealAssetDetail(id).catch(() => null);

    return <HousingDetailClient assetData={assetData} />;
}
