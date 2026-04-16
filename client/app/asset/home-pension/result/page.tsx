import PensionResultClient from './PensionResultClient';

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const realAssetId = Number(params.id);

  return <PensionResultClient realAssetId={realAssetId} />;
}
