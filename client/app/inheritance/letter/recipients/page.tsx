import { getInheritanceInfo } from '../../actions/letterActions';
import InheritanceLetterClient from './InheritanceLetterClient';

export default async function InheritanceLetterPage() {
  const recipients = await getInheritanceInfo();

  return <InheritanceLetterClient recipients={recipients} />;
}
