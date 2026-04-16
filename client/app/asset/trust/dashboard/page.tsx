import DashboardPageClient from './DashboardPageClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ grantorId?: string }>;
}) {
  const params = await searchParams;

  return <DashboardPageClient grantorId={params.grantorId ?? null} />;
}
