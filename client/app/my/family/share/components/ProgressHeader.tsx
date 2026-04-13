'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
// 공통 컴포넌트인 ProgressBar를 불러옵니다.
import ProgressBar from '@/components/baseelements/ProgressBar';
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
        {/* 기존에 자신을 호출하던 코드를 공통 ProgressBar로 교체 */}
        <ProgressBar step={step} total={4} />
      </div>
    </div>
  );
}
