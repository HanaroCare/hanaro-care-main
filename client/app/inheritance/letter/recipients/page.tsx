'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RecipientCard } from '../../components/letter/RecipientCard';
import type { Recipient } from '../../types';
import { formatAmount } from '../../utils/format';
import { mockRecipients } from '../data';

export default function InheritanceLetterPage() {
  const [recipients] = useState<Recipient[]>(mockRecipients);
  const router = useRouter();
  const totalAmount = 4020000000;

  return (
      <div className="flex min-h-screen w-full flex-col bg-white">
        {/* Content */}
        <div className="flex flex-1 flex-col gap-5 pt-8 pb-6">
          {/* Section title */}
          <h2 className="font-bold text-gray-900 text-xl">
            누구에게 남길까요?
          </h2>

          {/* Recipient list */}
          <div className="flex flex-col gap-3">
            {recipients.map((recipient) => (
              <RecipientCard
                key={recipient.id}
                recipient={recipient}
                onClick={() =>
                  router.push(`/inheritance/letter/recipients/${recipient.id}`)
                }
              />
            ))}
          </div>

          {/* Total summary */}
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
  );
}
