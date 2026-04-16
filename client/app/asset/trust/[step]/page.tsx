import { notFound } from 'next/navigation';
import OperationTypeStep from '@/app/asset/components/trust/steps/OperationTypeStep';
import PayoutTypeStep from '@/app/asset/components/trust/steps/PayoutTypeStep';
import PayoutUseStep from '@/app/asset/components/trust/steps/PayoutUseStep';
import SelectAgentStep from '@/app/asset/components/trust/steps/SelectAgentStep';
import SelectAssetsStep from '@/app/asset/components/trust/steps/SelectAssetsStep';
import StartTimingStep from '@/app/asset/components/trust/steps/StartTimingStep';

export default async function TrustStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;

  switch (step) {
    case 'select-assets':
      return <SelectAssetsStep />;
    case 'start-timing':
      return <StartTimingStep />;
    case 'operation-type':
      return <OperationTypeStep />;
    case 'payout-type':
      return <PayoutTypeStep />;
    case 'payout-use':
      return <PayoutUseStep />;
    case 'select-agent':
      return <SelectAgentStep />;
    default:
      notFound();
  }
}
