import { getRealAssetDetail } from '@/app/asset/actions/asset';
import GoldDetailClient from "@/app/asset/gold/[id]/GoldDetailClient";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function GoldDetailPage({ params }: Props) {
    const { id } = await params;
    const assetData = await getRealAssetDetail(id).catch(() => null);
    return <GoldDetailClient assetData={assetData} />;
}
