'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { getInheritanceInfo } from '@/app/inheritance/actions/letterActions';
import Letter from '@/app/inheritance/components/letter/Letter';
import { useLetter } from '@/app/inheritance/hooks/useLetter';

export default function InheritanceWritePage({
  params,
}: {
  params: Promise<{ inheritDetailId: string }>;
}) {
  const { inheritDetailId } = use(params);

  const { data: recipients, isLoading } = useQuery({
    queryKey: ['inheritanceInfo'],
    queryFn: () => getInheritanceInfo(),
  });

  const letterHook = useLetter(inheritDetailId);

  if (isLoading) return <div className="p-8 text-center">불러오는 중...</div>;

  const recipient = recipients?.find(
    (r) => String(r.inheritDetailId) === inheritDetailId,
  );

  if (!recipient)
    return <div className="p-8 text-center">대상을 찾을 수 없습니다.</div>;

  return <Letter recipient={recipient} hook={letterHook} />;
}
