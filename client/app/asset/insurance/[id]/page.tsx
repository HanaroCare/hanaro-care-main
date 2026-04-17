import { getInsuranceDetail } from '@/app/asset/actions/asset';
import InsuranceDetailClient from './InsuranceDetailClient';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function InsuranceDetailPage({ params }: Props) {
    const { id } = await params;

    try {
        const assetData = await getInsuranceDetail(id);

        if (!assetData) {
            notFound();
        }

        return <InsuranceDetailClient assetData={assetData} />;
    } catch {
        notFound();
    }
}
