'use client';

import { Suspense, useState } from 'react';
import GuardianStepRenderer from './components/StepRenderer';
import { useGuardianStep } from './hooks/useGuardianStep';
import type { GuardianData } from './types/types';

const TOTAL_STEPS = 7;

function GuardianContent() {
  const { currentStep, next, prev, goTo } = useGuardianStep(TOTAL_STEPS);
  const [data, setData] = useState<GuardianData>({
    selectedPerson: null,
    relationship: '',
    permissions: [false, false, false, false, false],
    userName: '',
    userPhone: '',
    verificationMethod: 'phone',
  });

  const updateData = (updates: Partial<GuardianData>) =>
    setData((d) => ({ ...d, ...updates }));

  return (
    <div className="flex min-h-[calc(100vh-150px)] items-start justify-center bg-white">
      <div className="w-full">
        <GuardianStepRenderer
          step={currentStep}
          data={data}
          updateData={updateData}
          next={next}
          prev={prev}
          goTo={goTo}
        />
      </div>
    </div>
  );
}

// useSearchParams를 사용하므로 Suspense로 감싸는 것이 Next.js 권장사항입니다.
export default function GuardianPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuardianContent />
    </Suspense>
  );
}
