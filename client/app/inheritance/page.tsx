import { redirect } from 'next/navigation';
import { getPlanSummary } from './actions/plan';

export default async function InheritancePage() {
  let hasPlan = false;

  try {
    await getPlanSummary();
    hasPlan = true;
  } catch {
    hasPlan = false;
  }

  if (hasPlan) {
    redirect('/inheritance/result');
  } else {
    redirect('/inheritance/intro');
  }
}