'use client';

import { toPng } from 'html-to-image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import LetterCard from '@/app/inheritance/components/letter/LetterCard';
import LetterSummary from '@/app/inheritance/components/letter/LetterSummary';

// TODO: 목데이터 정리 및 공컴
// TODO: s3에서 음원 불러오기
const mockResult = {
  nickname: '자기',
  userId: 1,
  relationCode: 'SPOUSE',
  distRatio: 30,
  inheritDetailId: 1,
  deliverAfterYears: 5,
  totalAmount: 134000000000,
  // letterType: "LETTER" as const,
  letterType: 'VOICE' as 'LETTER' | 'VOICE',
  letterContent:
    '사랑하는 가족들에게.\n항상 고맙고 미안한 마음이 컸어요.\n이 편지가 여러분에게 따뜻한 위로가 되었으면 좋겠습니다.\n앞으로도 서로 의지하며 행복하게 지내길 바랍니다.',
  voiceUrl:
    'https://s3.ap-northeast-2.amazonaws.com/your-bucket/audio/test.mp3',
};

export default function InheritanceCompletePage({
  searchParams,
}: {
  searchParams: { method?: string };
}) {
  const router = useRouter();

  const method = (searchParams.method as 'once' | 'divided') || 'once';

  const handleShare = async () => {
    if (mockResult.letterType === 'LETTER') {
      const shareData: ShareData = {
        title: '상속 편지',
        text: mockResult.letterContent ?? '',
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(mockResult.letterContent ?? '');
        alert('클립보드에 복사되었습니다.');
      }
    } else {
      const shareData: ShareData = {
        title: '상속 편지',
        url: mockResult.voiceUrl ?? window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(mockResult.voiceUrl ?? '');
        alert('클립보드에 복사되었습니다.');
      }
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
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full min-h-screen flex flex-col">
        {/* Content */}
        <div className="flex-1 flex flex-col gap-8 pt-8 pb-32">
          {/* 타이틀 */}
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-xl font-bold text-gray-900">
              편지 작성이 완료되었습니다
            </h2>
            <p className="text-sm text-gray-400">편지를 공유해보세요</p>
          </div>

          {/* 카드 */}
          <div ref={cardRef}>
            <LetterCard
              nickname={mockResult.nickname}
              recipientName={mockResult.relationCode}
              message={mockResult.letterContent}
              audioUrl={mockResult.voiceUrl}
            />
          </div>

          {/* 요약 */}
          <LetterSummary
            relationCode={mockResult.relationCode}
            distRatio={mockResult.distRatio}
            deliverAfterYears={mockResult.deliverAfterYears}
            letterType={mockResult.letterType}
            amount={mockResult.totalAmount * (mockResult.distRatio / 100)}
            inheritanceMethod={method}
            onImageSave={handleImageSave}
            onShare={handleShare}
          />
        </div>

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full px-6.25 pb-8 bg-white pt-4 flex gap-3">
          <button
            type="button"
            className="flex-1 py-4 h-auto rounded-2xl text-base font-semibold text-hana-green-700 bg-[#E9F8F9] hover:bg-hana-green-50"
            onClick={() => router.push('/inheritance/letter/recipients')}
          >
            추가 작성
          </button>
          <button
            type="button"
            className="flex-1 py-4 h-auto rounded-2xl text-base font-semibold bg-hana-green-700 hover:bg-hana-green-600 text-white"
            onClick={() => router.push('/inheritance')}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
