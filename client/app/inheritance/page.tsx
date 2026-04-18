import { redirect } from 'next/navigation';
import { getPlanSummary } from './actions/plan';

export default async function InheritancePage() {
  let plan = null;

  try {
    plan = await getPlanSummary();
  } catch (error) {
    console.error("Plan 로드 실패:", error);
    plan = null;
  }

  if (plan && plan.planId) {
    redirect('/inheritance/result');
  } else {
    redirect('/inheritance/intro');
  }
}