import { Download, Send } from 'lucide-react';
import type { LetterType } from '../../letter/types';
import type { InheritanceMethod } from '../../types';
import { formatAmount } from '../../utils/format';

interface Props {
  message: string;
  audioUrl: string;
  relationCode: string;
  distRatio: number;
  amount: number;
  deliverAfterYears: number | null;
  letterType: LetterType;
  inheritanceMethod: InheritanceMethod;
  onImageSave: () => void;
}

const METHOD_LABEL: Record<InheritanceMethod, string> = {
  once: '한번에 전달',
  divided: '나눠서 전달',
};

export default function LetterSummary({
  message,
  audioUrl,
  relationCode,
  distRatio,
  deliverAfterYears,
  letterType,
  amount,
  inheritanceMethod,
  onImageSave,
}: Props) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        const isVoice = letterType === 'VOICE';

        await navigator.share({
          title: '상속 편지',
          text: isVoice ? '음성 편지를 들어보세요 🎧' : message,
          url: isVoice ? audioUrl : undefined,
        });
      } else {
        const fallbackText = letterType === 'WRITING' ? message : audioUrl;

        await navigator.clipboard.writeText(fallbackText);
        alert('복사되었습니다.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 px-5 py-4">
      {/* 상단 정보 */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700 text-sm">
          {relationCode} ( {distRatio * 100}% )
        </span>
        <span className="font-semibold text-gray-900 text-sm">
          {formatAmount(amount)}
        </span>
      </div>

      {/* 전달 조건 */}
      <p className="text-gray-400 text-xs">
        {deliverAfterYears ? `${deliverAfterYears}년 후` : '즉시'} ·{' '}
        {METHOD_LABEL[inheritanceMethod]}
      </p>

      {/* 버튼 */}
      <div className="mt-1 flex gap-3">
        {letterType === 'WRITING' && (
          <button
            type="button"
            className="flex flex-1 items-center gap-2 rounded-xl border-2 border-gray-200 p-2 text-sm"
            onClick={onImageSave}
          >
            <Download className="m-2 h-4 w-4" />
            이미지 저장
          </button>
        )}
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-3 rounded-xl border-2 border-gray-200 p-2 text-sm"
          onClick={handleShare}
        >
          <Send className="m-2 mr-0 h-4 w-4" />
          공유하기
        </button>
      </div>
    </div>
  );
}
