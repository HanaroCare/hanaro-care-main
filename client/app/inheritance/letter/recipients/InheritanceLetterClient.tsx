'use client';

import { useRouter } from 'next/navigation';
import { RecipientCard } from '../../components/letter/RecipientCard';
import { formatAmount } from '../../utils/format';
import type { InheritanceSummaryDto } from '../types';

export default function InheritanceLetterClient({
  recipients,
}: {
  recipients: InheritanceSummaryDto[];
}) {
  const router = useRouter();

  const totalAmount =
    recipients?.reduce(
      (acc: number, curr: InheritanceSummaryDto) => acc + (curr.amt || 0),
      0,
    ) || 0;

  if (!recipients) {
    return (
      <div className="p-8 text-center text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-155px)] w-full flex-col bg-white">
      <div className="flex w-full flex-col">
        <div className="flex flex-1 flex-col gap-5 pt-8 pb-6">
          <h2 className="font-bold text-gray-900 text-xl">
            누구에게 남길까요?
          </h2>

          <div className="flex flex-col gap-3">
            {recipients.map((recipient: InheritanceSummaryDto) => (
              <RecipientCard
                key={recipient.inheritDetailId}
                recipient={{
                  inheritDetailId: recipient.inheritDetailId,
                  userId: recipient.userId,
                  username: recipient.username,
                  percent: recipient.percent,
                  amt: recipient.amt,
                }}
                onClick={() => {
                  router.push(
                    `/inheritance/letter/recipients/${recipient.inheritDetailId}`,
                  );
                }}
              />
            ))}
          </div>

          <div className="mt-1 flex items-center justify-between rounded-2xl bg-gray-100 px-5 py-4">
            <span className="font-medium text-gray-600 text-sm">
              총 {recipients.length}명
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
