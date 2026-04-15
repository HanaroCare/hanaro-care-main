'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  type InheritanceSummaryDto,
  inheritanceApi,
} from '@/app/inheritance/inheritApi';
import { RecipientCard } from '../../components/letter/RecipientCard';
import { formatAmount } from '../../utils/format';

export default function InheritanceLetterPage() {
  const router = useRouter();

  // 1. 백엔드에서 상속 가족 목록 가져오기
  const {
    data: recipients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inheritanceInfo'],
    queryFn: () => inheritanceApi.getInheritanceInfo(),
  });

  // 2. 총액 계산 (데이터가 있을 때 amt 필드 합산)
  const totalAmount =
    recipients?.reduce(
      (acc: number, curr: InheritanceSummaryDto) => acc + (curr.amt || 0),
      0,
    ) || 0;

  if (isLoading)
    return <div className="p-8 text-center">목록을 불러오는 중...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1 flex-col gap-5 pt-8 pb-6">
          <h2 className="font-bold text-gray-900 text-xl">
            누구에게 남길까요?
          </h2>

          <div className="flex flex-col gap-3">
            {recipients?.map((recipient: InheritanceSummaryDto) => (
              <RecipientCard
                key={recipient.id}
                // DTO 필드명에 맞춰 props 매핑 (RecipientCard 내부 구조에 따라 조정 필요)
                recipient={{
                  id: recipient.id,
                  username: recipient.username, // InheritanceSummaryDto의 username
                  percent: recipient.percent, // InheritanceSummaryDto의 percent
                  amt: recipient.amt, // InheritanceSummaryDto의 amt
                }}
                onClick={() =>
                  router.push(`/inheritance/letter/recipients/${recipient.id}`)
                }
              />
            ))}
          </div>

          <div className="mt-1 flex items-center justify-between rounded-2xl bg-gray-100 px-5 py-4">
            <span className="font-medium text-gray-600 text-sm">
              총 {recipients?.length || 0}명
            </span>
            <span className="font-bold text-base text-gray-900">
              {formatAmount(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
