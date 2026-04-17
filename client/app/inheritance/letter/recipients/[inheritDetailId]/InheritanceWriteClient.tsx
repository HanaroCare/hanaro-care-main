'use client';

import Letter from '@/app/inheritance/components/letter/Letter';
import { useLetter } from '@/app/inheritance/hook/useLetter';
import type { InheritanceSummaryDto } from '@/app/inheritance/letter/types';

export default function InheritanceWriteClient({
  inheritDetailId,
  recipients,
}: {
  inheritDetailId: string;
  recipients: InheritanceSummaryDto[];
}) {
  const letterHook = useLetter(inheritDetailId);

  const recipient = recipients.find(
    (r) => String(r.inheritDetailId) === inheritDetailId,
  );

  if (!recipient) {
    return <div className="p-8 text-center">대상을 찾을 수 없습니다.</div>;
  }

  return <Letter recipient={recipient} hook={letterHook} />;
}
