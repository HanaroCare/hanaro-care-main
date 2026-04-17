import { getInheritanceContext } from '../../actions/plan';
import InheritancePlanClient from './InheritancePlanClient';

export default async function Page() {
  const context = await getInheritanceContext();

  return <InheritancePlanClient initialData={context} />;
}
