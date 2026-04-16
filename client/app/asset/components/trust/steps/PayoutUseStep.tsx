import { getSimulationSummary } from '@/app/asset/actions/asset';
import PayoutUseStepClient from './PayoutUseStepClient';

const DEFAULT_HOSPITAL_AMOUNT = 430000;
const DEFAULT_LIVING_AMOUNT = 1000000;

export default async function PayoutUseStep() {
  const summary = await getSimulationSummary();

  const hospitalAmount = summary.ok
    ? summary.data.medicalCost
    : DEFAULT_HOSPITAL_AMOUNT;

  const livingAmount = summary.ok
    ? summary.data.livingCost
    : DEFAULT_LIVING_AMOUNT;
  return (
    <PayoutUseStepClient
      hospitalAmount={hospitalAmount}
      livingAmount={livingAmount}
    />
  );
}
