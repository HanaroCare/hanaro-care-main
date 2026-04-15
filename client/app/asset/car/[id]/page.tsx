import { getRealAssetDetail } from '@/app/asset/actions/asset';
import CarDetailClient from "@/app/asset/car/[id]/CarDetailClient";
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
    const { id } = await params;

    try {
        const assetData = await getRealAssetDetail(id);

        if (!assetData) {
            notFound();
        }

        return <CarDetailClient assetData={assetData} />;

    } catch (error) {
        console.error("자동차 상세 조회 중 에러 발생:", error);
        notFound();
    }
}
