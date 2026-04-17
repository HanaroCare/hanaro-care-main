'use client';

import { useQuery } from '@tanstack/react-query';
import { getInsurances } from '../actions/insuranceActions';
import InsuranceList from './components/InsuranceList';

export default function MyFamilyInsurancePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['familyInsurances'],
    queryFn: () => getInsurances(),
  });

  if (isLoading)
    return (
      <div className="py-20 text-center text-gray-400">
        정보를 불러오는 중...
      </div>
    );
  if (isError || !data)
    return (
      <div className="py-20 text-center text-red-400">
        데이터 로드에 실패했습니다.
      </div>
    );

  return (
    <InsuranceList
      initialInsurances={data.insurances}
      initialIsInsAgent={data.isInsAgent}
    />
  );
}
