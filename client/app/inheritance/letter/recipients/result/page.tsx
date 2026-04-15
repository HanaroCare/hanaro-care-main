'use client';

import { useQuery } from '@tanstack/react-query'; // React Query 필요
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { use, useRef } from 'react';
import LetterCard from '@/app/inheritance/components/letter/LetterCard';
import LetterSummary from '@/app/inheritance/components/letter/LetterSummary';
import { inheritanceApi } from '@/app/inheritance/inheritApi';
import DualActionFooter from '@/components/modules/DualActionFooter';

export default function InheritanceCompletePage({
  searchParams,
}: {
  searchParams: Promise<{
    method?: string;
    nickname?: string;
    yearsLater?: string;
    id?: string; // inheritDetailId
  }>;
}) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);

  // 1. URL Query Params (프론트 전용 데이터)
  const method = (resolvedSearchParams.method as 'once' | 'divided') || 'once';
  const nickname = resolvedSearchParams.nickname || '가족';
  const deliverAfterYears = Number(resolvedSearchParams.yearsLater) || 0;
  const inheritDetailId = resolvedSearchParams.id;

  // 2. API 데이터 1: LetterResponseDto (편지 내용)
  const { data: letterData, isLoading: isLetterLoading } = useQuery({
    queryKey: ['letter', inheritDetailId],
    queryFn: () => inheritanceApi.getLetter(inheritDetailId!),
    enabled: !!inheritDetailId,
  });

  // 3. API 데이터 2: InheritanceSummaryDto (가족 상속 정보)
  // 전체 목록에서 해당 ID를 찾거나, 특정 요약 API를 호출한다고 가정
  const { data: summaryList, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['inheritanceSummary'],
    queryFn: () => inheritanceApi.getInheritanceInfo(),
  });

  // 현재 상세 ID와 일치하는 가족 정보 찾기
  const currentSummary = summaryList?.find(
    (s) => String(s.id) === inheritDetailId,
  );

  // 4. 데이터 조립 (Mock 대신 사용)
  const result = {
    nickname: nickname,
    relationCode: currentSummary?.username || '가족', // 혹은 관계 코드
    distRatio: currentSummary?.percent || 0,
    deliverAfterYears: deliverAfterYears,
    totalAmount: currentSummary?.amt || 0,
    letterType: letterData?.letterTypeCd || 'LETTER',
    letterContent: letterData?.letterCont || '',
    voiceUrl: letterData?.voiceUrl || '',
  };

  const handleShare = async () => {
    const isLetter = result.letterType === 'LETTER';
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
            />
          </div>

          <LetterSummary
            relationCode={result.relationCode}
            distRatio={result.distRatio}
            deliverAfterYears={result.deliverAfterYears}
            letterType={result.letterType}
            amount={result.totalAmount * (result.distRatio / 100)}
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
