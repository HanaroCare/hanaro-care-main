import { getRealAssetDetail } from '@/app/asset/actions/asset';
import HousingDetailClient from "@/app/asset/housing/[id]/HousingDetailClient";
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function HousingDetailPage({ params }: Props) {
    const { id } = await params;

    try {
        const assetData = await getRealAssetDetail(id);

        if (!assetData) {
            notFound();
        }

        return <HousingDetailClient assetData={assetData} />;

    } catch (error) {
        console.error("부동산 상세 조회 중 에러 발생:", error);
        notFound();
    }
}
