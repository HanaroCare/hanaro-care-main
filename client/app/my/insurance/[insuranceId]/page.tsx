'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getInsuranceDetail } from '../../actions/insuranceActions';
import InsuranceDetail from '../components/InsuranceDetail';

export default function MyFamilyInsuranceDetailPage() {
  const params = useParams();
  const insuranceId = params.insuranceId as string;

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['insuranceDetail', insuranceId],
    queryFn: () => getInsuranceDetail(insuranceId),
    enabled: !!insuranceId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400 text-sm">
          보험 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400 text-sm">
          보험 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return <InsuranceDetail detail={detail} />;
}
