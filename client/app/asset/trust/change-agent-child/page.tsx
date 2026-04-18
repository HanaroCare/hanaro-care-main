import ChangeAgentChildPageClient from './ChangeAgentChildPageClient';

type PageProps = {
  searchParams: Promise<{
    name?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const parentName = params.name ?? null;

  return <ChangeAgentChildPageClient parentName={parentName} />;
}
