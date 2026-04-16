import DevAdminClient from './DevAdminClient';

export default function Page() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return <DevAdminClient />;
}
