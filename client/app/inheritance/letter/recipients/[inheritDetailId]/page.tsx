import { getInheritanceInfo } from '@/app/inheritance/actions/letterActions';
import InheritanceWriteClient from './InheritanceWriteClient';

export default async function InheritanceWritePage({
  params,
}: {
  params: { inheritDetailId: string };
}) {
  const { inheritDetailId } = await params;

  const recipients = await getInheritanceInfo();

  return (
    <InheritanceWriteClient
      inheritDetailId={inheritDetailId}
      recipients={recipients}
    />
  );
}
