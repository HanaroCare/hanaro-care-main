import { getRealAssetDetail } from '@/app/asset/actions/asset';
import CarDetailClient from "@/app/asset/car/[id]/CarDetailClient";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
    const { id } = await params;

    const assetData = await getRealAssetDetail(id).catch((error) => {
        console.error("자동차 상세 조회 실패:", error);
        return null;
    });

    return <CarDetailClient assetData={assetData} />;
}
