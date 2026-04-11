"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "../../components/letter/Header";
import { RecipientCard } from "../../components/letter/RecipientCard";
import type { Recipient } from "../../types";
import { formatAmount } from "../../utils/format";
import { mockRecipients } from "../data";

// TODO: 공컴
export default function InheritanceLetterPage() {
  const [recipients] = useState<Recipient[]>(mockRecipients);
  const router = useRouter();
  const totalAmount = 4020000000;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      {/* Mobile container */}
      <div className="w-full max-w-sm min-h-screen bg-white flex flex-col">

        {/* Content */}
        <div className="flex-1 px-5 pt-8 pb-6 flex flex-col gap-5">
          {/* Section title */}
          <h2 className="text-xl font-bold text-gray-900">
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
          <div className="bg-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between mt-1">
            <span className="text-sm font-medium text-gray-600">
              총 {recipients.length}명
            </span>
            <span className="text-base font-bold text-gray-900">
              {formatAmount(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
