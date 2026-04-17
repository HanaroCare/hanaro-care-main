'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import {
  getInheritanceInfo,
  getLetter,
} from '@/app/inheritance/actions/letterActions';
import LetterResult from '@/app/inheritance/components/letter/LetterResult';
import type { InheritanceSummaryDto } from '../../types';

export default function InheritanceCompletePage({
  searchParams,
}: {
  searchParams: Promise<{
    method?: string;
    nickname?: string;
    yearsLater?: string;
    inheritDetailId?: string;
  }>;
}) {
  const resolvedSearchParams = use(searchParams);

  const inheritDetailId = resolvedSearchParams.inheritDetailId;
  const method = (resolvedSearchParams.method as 'once' | 'divided') || 'once';
  const nickname = resolvedSearchParams.nickname || '가족';
  const deliverAfterYears = Number(resolvedSearchParams.yearsLater) || 0;

  // 1. 편지 상세 정보 조회
  const { data: letterData, isLoading: isLetterLoading } = useQuery({
    queryKey: ['letter', inheritDetailId],
    queryFn: () => getLetter(inheritDetailId!),
    enabled: !!inheritDetailId,
  });

  // 2. 상속 요약 리스트 조회
  const { data: summaryList, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['inheritanceSummary'],
    queryFn: () => getInheritanceInfo(),
  });

  if (isLetterLoading || isSummaryLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-gray-500">정보를 불러오는 중...</p>
      </div>
    );
  }

  // 데이터 가공 로직
  const currentSummary = summaryList?.find(
    (s: InheritanceSummaryDto) => String(s.inheritDetailId) === inheritDetailId,
  );

  const result = {
    nickname,
    relationCode: currentSummary?.username || '가족',
    distRatio: currentSummary?.percent || 0,
    deliverAfterYears,
    totalAmount: currentSummary?.amt || 0,
    letterType: letterData?.letterTypeCd || 'WRITING',
    letterContent: letterData?.letterCont || '',
    voiceUrl: letterData?.voiceUrl || '',
  };

  return (
    <div className="flex min-h-full flex-col items-center bg-white">
      <div className="flex min-h-full w-full flex-col">
        <LetterResult result={result} method={method} />
      </div>
    </div>
  );
}
