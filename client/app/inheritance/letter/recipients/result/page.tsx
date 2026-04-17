import {
  getInheritanceInfo,
  getLetter,
} from '@/app/inheritance/actions/letterActions';
import InheritanceCompleteClient from './InheritanceCompleteClient';

export default async function InheritanceCompletePage({
  searchParams,
}: {
  searchParams: Promise<{
    method?: string;
    nickname?: string;
    yearsLater?: string;
    inheritDetailId?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const inheritDetailId = resolvedSearchParams.inheritDetailId;

  if (!inheritDetailId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">잘못된 접근입니다.</p>
      </div>
    );
  }

  const [letterData, summaryList] = await Promise.all([
    getLetter(inheritDetailId),
    getInheritanceInfo(),
  ]);

  const currentSummary = summaryList?.find(
    (s: any) => String(s.inheritDetailId) === inheritDetailId,
  );

  const result = {
    inheritDetailId: inheritDetailId,
    nickname: resolvedSearchParams.nickname || '가족',
    relationCode: currentSummary?.username || '가족',
    distRatio: currentSummary?.percent || 0,
    deliverAfterYears: Number(resolvedSearchParams.yearsLater) || 0,
    totalAmount: currentSummary?.amt || 0,
    letterType: letterData?.letterTypeCd || 'WRITING',
    letterContent: letterData?.letterCont || '',
    voiceUrl: letterData?.voiceUrl || '',
  };

  return (
    <InheritanceCompleteClient
      result={result}
      method={(resolvedSearchParams.method as 'once' | 'divided') || 'once'}
    />
  );
}
