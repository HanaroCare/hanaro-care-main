import { notFound } from 'next/navigation';
import { getInsuranceDetail } from '../../actions/insuranceActions';
import InsuranceDetailClient from '@/app/asset/insurance/[id]/InsuranceDetailClient';

interface Props {
  // params의 키값이 폴더명과 정확히 일치해야 합니다. 
  // 폴더가 [id]면 id, [insuranceId]면 insuranceId
  params: Promise<{ [key: string]: string }>;
}

export default async function MyFamilyInsuranceDetailPage({ params }: Props) {
  const resolvedParams = await params;

  // 폴더명이 [insuranceId]인지 [id]인지에 따라 선택
  const id = resolvedParams.insuranceId || resolvedParams.id;

  console.log('🔍 브라우저에서 받은 ID:', id);

  if (!id) return notFound();

  try {
    const detail = await getInsuranceDetail(id);

    // 서버 터미널(브라우저 아님!) 로그를 확인하세요
    console.log('📦 서버에서 받아온 detail 데이터:', detail);

    if (!detail) {
      console.log('⚠️ 데이터가 비어있어서 404를 띄웁니다.');
      return notFound();
    }

    // props 명칭이 assetData가 맞는지 InsuranceDetailClient 정의를 확인하세요.
    return <InsuranceDetailClient assetData={detail as any} />;
  } catch (error) {
    console.error("❌ 보험 상세 조회 중 에러 발생:", error);
    return notFound();
  }
}