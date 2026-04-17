'use client';

import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import LetterCard from '@/app/inheritance/components/letter/LetterCard';
import LetterSummary from '@/app/inheritance/components/letter/LetterSummary';
import DualActionFooter from '@/components/modules/DualActionFooter';
import { LetterType } from "@/app/inheritance/letter/types";

interface LetterResultProps {
  result: {
    nickname: string;
    relationCode: string;
    distRatio: number;
    deliverAfterYears: number;
    totalAmount: number;
    letterType: LetterType;
    letterContent: string;
    voiceUrl: string;
  };
  method: 'once' | 'divided';
}

export default function LetterResult({ result, method }: LetterResultProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const isLetter = result.letterType === 'WRITING';
    const shareData: ShareData = {
      title: '상속 편지',
      text: isLetter ? result.letterContent : undefined,
      url: !isLetter ? result.voiceUrl : window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => { });
    } else {
      await navigator.clipboard.writeText(
        isLetter ? result.letterContent : result.voiceUrl,
      );
      alert('복사되었습니다.');
    }
  };

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

  return (
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
          letterType={result.letterType as LetterType}
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
  );
}
