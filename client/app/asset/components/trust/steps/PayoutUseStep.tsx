import { getSimulationSummary } from '@/app/asset/actions/asset';
import PayoutUseStepClient from './PayoutUseStepClient';

const DEFAULT_HOSPITAL_AMOUNT = 430000;
const DEFAULT_LIVING_AMOUNT = 1000000;

export default async function PayoutUseStep() {
  const summary = await getSimulationSummary();

  const segments = summary?.ok ? (summary.data?.age_segments ?? []) : [];

  const firstSegment = segments[0];

  const hospitalAmount = firstSegment?.detail.medical || DEFAULT_HOSPITAL_AMOUNT;
  const livingAmount = firstSegment?.detail.living || DEFAULT_LIVING_AMOUNT;

  return (
    <PayoutUseStepClient
      hospitalAmount={hospitalAmount}
      livingAmount={livingAmount}
      showCalculatorAlert={summary?.ok ?? false}
    />
  );
}
