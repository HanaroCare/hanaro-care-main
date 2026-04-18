

import { getInheritanceContext } from '@/app/inheritance/actions/plan';
import InheritancePlanDetailClient from './InheritancePlanDetailClient';

export default async function Page() {
  const context = await getInheritanceContext();
  return <InheritancePlanDetailClient initialData={context} />;
}