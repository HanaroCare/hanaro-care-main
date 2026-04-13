'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import TrustProgressBar from '@/app/asset/components/trust/TrustProgressBar';
import Header from '@/components/navigation/Header';

interface ProgressHeaderProps {
  step: number;
}

export default function ProgressHeader({ step }: ProgressHeaderProps) {
  const router = useRouter();

  return (
    <div className="z-20 flex w-full shrink-0 flex-col bg-white">
      <Header
        title="보험 내역 공유"
        onBack={() => router.push('/my/family' as Route)}
        showCloseButton={true}
        onClose={() => router.push('/my/family' as Route)}
      />
      <div className="px-6 py-2">
        <TrustProgressBar step={step} total={4} />
      </div>
    </div>
  );
}
