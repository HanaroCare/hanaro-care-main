import { notFound } from 'next/navigation';
import { getMyInfo } from './actions/admin';
import DevAdminClient from './DevAdminClient';

export default async function Page() {
  const me = await getMyInfo();

  if (!me || me.userRole !== 'ROLE_ADMIN') {
    notFound();
  }

  return <DevAdminClient />;
}
