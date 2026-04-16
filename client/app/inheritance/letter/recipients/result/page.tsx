'use client';

import { useQuery } from '@tanstack/react-query';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { use, useRef } from 'react';
import { inheritanceApi } from '@/app/inheritance/api/inheritApi';
import LetterCard from '@/app/inheritance/components/letter/LetterCard';
import LetterSummary from '@/app/inheritance/components/letter/LetterSummary';
import DualActionFooter from '@/components/modules/DualActionFooter';

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
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);

  console.log('searchParams:', resolvedSearchParams);

  const method = (resolvedSearchParams.method as 'once' | 'divided') || 'once';
  const nickname = resolvedSearchParams.nickname || '가족';
  const deliverAfterYears = Number(resolvedSearchParams.yearsLater) || 0;
  const inheritDetailId = resolvedSearchParams.inheritDetailId;
  console.log('123' + inheritDetailId);
  const { data: letterData, isLoading: isLetterLoading } = useQuery({
    queryKey: ['letter', inheritDetailId],
    queryFn: () => inheritanceApi.getLetter(inheritDetailId!),
    enabled: !!inheritDetailId,
  });

  const { data: summaryList, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['inheritanceSummary'],
    queryFn: () => inheritanceApi.getInheritanceInfo(),
  });

  console.log('summaryList:', summaryList);

  const currentSummary = summaryList?.find(
    (s) => String(s.inheritDetailId) === inheritDetailId,
  );

  const result = {
    nickname: nickname,
    relationCode: currentSummary?.username || '가족',
    distRatio: currentSummary?.percent || 0,
    deliverAfterYears: deliverAfterYears,
    totalAmount: currentSummary?.amt || 0,
    letterType: letterData?.letterTypeCd || 'WRITING',
    letterContent: letterData?.letterCont || '',
    voiceUrl: letterData?.voiceUrl || '',
  };
  console.log(result);
  const handleShare = async () => {
    const isLetter = result.letterType === 'WRITING';
    const shareData: ShareData = {
      title: '상속 편지',
      text: isLetter ? result.letterContent : undefined,
      url: !isLetter ? result.voiceUrl : window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(
        isLetter ? result.letterContent : result.voiceUrl,
      );
      alert('복사되었습니다.');
    }
  };

  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageSave = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = 'inheritance-letter.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
    }
  };

  if (isLetterLoading || isSummaryLoading)
    return <div>정보를 불러오는 중...</div>;

  return (
    <div className="flex min-h-full flex-col items-center bg-white">
      <div className="flex min-h-full w-full flex-col">
        <div className="flex flex-1 flex-col gap-8 pt-8 pb-10">
          <div className="flex flex-col items-center gap-1">
            <h2 className="font-bold text-gray-900 text-xl">
              편지 작성이 완료되었습니다
            </h2>
            <p className="text-gray-400 text-sm">편지를 공유해보세요</p>
          </div>

          <div ref={cardRef}>
            <LetterCard
              nickname={result.nickname}
              recipientName={result.relationCode}
              message={result.letterContent}
              audioUrl={result.voiceUrl}
              letterType={result.letterType}
            />
          </div>

          <LetterSummary
            relationCode={result.relationCode}
            distRatio={result.distRatio}
            deliverAfterYears={result.deliverAfterYears}
            letterType={result.letterType}
            amount={result.totalAmount}
            inheritanceMethod={method}
            onImageSave={handleImageSave}
            onShare={handleShare}
          />

          <DualActionFooter
            leftLabel="추가 작성"
            rightLabel="완료"
            onLeftClick={() => router.push('/inheritance/letter/recipients')}
            onRightClick={() => router.push('/inheritance')}
            className="-mx-6.25 flex w-[calc(100%+3.125rem)] gap-3 bg-white px-6.25!"
          />
        </div>
      </div>
    </div>
  );
}
