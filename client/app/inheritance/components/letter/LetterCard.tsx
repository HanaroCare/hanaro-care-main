import type { LetterType } from '../../letter/types';
import AudioPlayer from './AudioPlayer';

interface Props {
  nickname: string;
  recipientName: string;
  message: string | null;
  audioUrl: string | null;
  elasped?: number;
  letterType: LetterType;
}

export default function LetterCard({
  nickname,
  recipientName,
  message,
  audioUrl,
  letterType,
}: Props) {
  return (
    <div className="relative flex h-56 w-full items-center justify-center">
      {/* 뒤 카드들 */}
      <div className="-rotate-10 absolute h-44 w-[88%] rounded-3xl bg-[#F5E4B1]" />
      <div className="-rotate-4 absolute h-44 w-[88%] rounded-3xl bg-[#BFECD8]" />
      <div className="absolute h-44 w-[88%] rotate-7 rounded-3xl bg-[#F8CEDB]" />

      {/* 메인 카드 */}
      <div className="relative flex h-44 w-[88%] flex-col rounded-3xl bg-[#2C3E5D] px-5 py-4">
        {/* To. 닉네임 */}
        <p className="font-semibold text-base text-white">To. {nickname}</p>

        {/* 내용 */}
        {letterType === 'WRITING' ? (
          <p className="mt-1 text-sm text-white leading-relaxed">{message}</p>
        ) : audioUrl ? (
          <AudioPlayer
            audioUrl={audioUrl}
            bgColor=""
            buttonColor="text-white fill-white"
            timeColor="text-white"
            className="w-full pt-2"
          />
        ) : null}

        {/* 배우자 태그 */}
        <div className="absolute right-5 bottom-4">
          <span className="rounded-full bg-[#3D5070] px-3 py-1 text-white text-xs">
            {recipientName}
          </span>
        </div>
      </div>
    </div>
  );
}
