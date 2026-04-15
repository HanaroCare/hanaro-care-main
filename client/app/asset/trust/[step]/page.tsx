'use client';

import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';
import { use } from 'react';
import OperationTypeStep from '@/app/asset/components/trust/steps/OperationTypeStep';
import PayoutTypeStep from '@/app/asset/components/trust/steps/PayoutTypeStep';
import PayoutUseStep from '@/app/asset/components/trust/steps/PayoutUseStep';
import SelectAgentStep from '@/app/asset/components/trust/steps/SelectAgentStep';
import SelectAssetsStep from '@/app/asset/components/trust/steps/SelectAssetsStep';
import StartTimingStep from '@/app/asset/components/trust/steps/StartTimingStep';

const stepComponents: Record<string, ComponentType> = {
  'select-assets': SelectAssetsStep,
  'start-timing': StartTimingStep,
  'operation-type': OperationTypeStep,
  'payout-type': PayoutTypeStep,
  'payout-use': PayoutUseStep,
  'select-agent': SelectAgentStep,
};

export default function TrustStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = use(params);
  const StepComponent = stepComponents[step];

  if (!StepComponent) notFound();

  return <StepComponent />;
}
