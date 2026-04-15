'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InheritancePage() {
  const router = useRouter();

  useEffect(() => {
    // 사용자의 상속 설계 완료 여부 확인
    const isCompleted = localStorage.getItem('inheritance_completed');

    if (isCompleted === 'true') {
      router.replace('/inheritance/result');
    } else {
      router.replace('/inheritance/intro');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse font-medium text-[var(--color-hana-ez-600)]">
        상속 설계 설정을 확인 중입니다...
      </div>
    </div>
  );
}
