import { getRealAssetDetail } from '@/app/asset/actions/asset';
import GoldDetailClient from "@/app/asset/gold/[id]/GoldDetailClient";
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function GoldDetailPage({ params }: Props) {
    const { id } = await params;

    try {
        const assetData = await getRealAssetDetail(id);
        if (!assetData) {
            notFound();
        }

        return <GoldDetailClient assetData={assetData} />;

    } catch (error) {
        console.error("자산 조회 중 에러 발생:", error);
        notFound();
    }
}
