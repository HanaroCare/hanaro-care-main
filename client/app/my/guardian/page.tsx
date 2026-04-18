'use client';

import { Suspense, useState } from 'react';
import GuardianStepRenderer from './components/StepRenderer';
import { useGuardianStep } from './hooks/useGuardianStep';
import type { GuardianData } from './types/types';
import { findId } from '@/app/(auth)/login/actions/user';
import { getUserName } from '../actions/guardianActions';

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

export default function GuardianPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuardianContent />
    </Suspense>
  );
}
