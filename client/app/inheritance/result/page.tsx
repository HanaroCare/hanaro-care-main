import { getPlanSummary } from '@/app/inheritance/actions/plan';
import InheritanceResultClient from './InheritanceResultClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  
  try {
    const planData = await getPlanSummary();
    return <InheritanceResultClient initialData={planData} />;
  } catch {
    redirect('/inheritance/intro');
  }
}