import { getUserName } from '../actions/getUserName';
import InheritanceLetter from '../components/letter/LetterIntro';

export default async function InheritanceLetterPage() {
  const userName = await getUserName();
  return <InheritanceLetter userName={userName} />;
}
