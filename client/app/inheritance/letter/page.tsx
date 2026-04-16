import { getUserName } from '@/app/my/actions/guardianActions';
import InheritanceLetter from '../components/letter/LetterIntro';

export default async function InheritanceLetterPage() {
  const userName = await getUserName();
  return <InheritanceLetter userName={userName} />;
}
