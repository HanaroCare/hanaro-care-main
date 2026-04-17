'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useGuardianStep(totalSteps: number) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStep = useMemo(() => {
    const step = Number(searchParams.get('step') ?? '0');
    return Math.min(Math.max(step, 0), totalSteps - 1);
  }, [searchParams, totalSteps]);

  const goTo = useCallback(
    (step: number) => {
      router.push(`/my/guardian?step=${step}`);
    },
    [router],
  );

  const next = useCallback(() => {
    goTo(currentStep + 1);
  }, [currentStep, goTo]);

  const prev = useCallback(() => {
    router.back();
  }, [router]);

  return { currentStep, next, prev, goTo };
}
