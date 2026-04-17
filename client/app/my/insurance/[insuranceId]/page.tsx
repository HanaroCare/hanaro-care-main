import { notFound } from 'next/navigation';
import InsuranceDetailClient from '@/app/asset/insurance/[id]/InsuranceDetailClient';
import { getInsuranceDetail } from '../../actions/insuranceActions';

interface Props {
  params: Promise<{ [key: string]: string }>;
}

export default async function MyFamilyInsuranceDetailPage({ params }: Props) {
  const resolvedParams = await params;

  const id = resolvedParams.insuranceId || resolvedParams.id;
  if (!id) return notFound();

  try {
    const detail = await getInsuranceDetail(id);
    if (!detail) {
      return notFound();
    }
    return <InsuranceDetailClient assetData={detail as any} />;
  } catch (error) {
    return notFound();
  }
}
