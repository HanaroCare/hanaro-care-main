import AudioPlayer from "./AudioPlayer";

interface Props {
  nickname: string;
  recipientName: string;
  message: string | null;
  audioUrl: string | null;
  elasped?: number;
}

export default function LetterCard({
  nickname,
  recipientName,
  message,
  audioUrl,
}: Props) {
  message = null; // * 변경
  return (
    <div className="relative w-full flex items-center justify-center h-56">
      {/* 뒤 카드들 */}
      <div className="absolute w-[88%] h-44 bg-[#F5E4B1] rounded-3xl -rotate-10" />
      <div className="absolute w-[88%] h-44 bg-[#BFECD8] rounded-3xl -rotate-4" />
      <div className="absolute w-[88%] h-44 bg-[#F8CEDB] rounded-3xl rotate-7" />

      {/* 메인 카드 */}
      <div className="relative w-[88%] h-44 bg-[#2C3E5D] rounded-3xl px-5 py-4 flex flex-col">
        {/* To. 닉네임 */}
        <p className="text-white font-semibold text-base">To. {nickname}</p>

        {/* 내용 */}
        {message ? (
          <p className="text-white text-sm leading-relaxed mt-2">"{message}"</p>
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
        <div className="absolute bottom-4 right-5">
          <span className="bg-[#3D5070] text-white text-xs px-3 py-1 rounded-full">
            {recipientName}
          </span>
        </div>
      </div>
    </div>
  );
}
