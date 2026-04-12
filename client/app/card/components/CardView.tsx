const CARD_DESIGN_MAP: Record<string, string> = {
  "김복자 요양사의 카드": "/images/card/careCard_1.png",
  "한금순 요양사의 카드": "/images/card/careCard_3.png",
};

interface CardViewProps {
  cardNm: string;
}

export default function CardView({ cardNm }: CardViewProps) {
  const bgImage = CARD_DESIGN_MAP[cardNm];

  return (
    <div
      className="relative w-[262px] h-[165px] rounded-xl overflow-hidden"
      style={
        bgImage
          ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: "linear-gradient(111.45deg, #008485 2.93%, #C5FFFA 98.1%)" }
      }
    >
      {/* 반투명 원 */}
      {!bgImage && (
        <div
          className="absolute w-[79px] h-[79px] rounded-full right-0 bottom-2"
          style={{
            background: "linear-gradient(124.87deg, rgba(255,255,255,0.5) 16.85%, rgba(255,255,255,0.25) 84.45%)",
          }}
        />
      )}

      {/* 카드 텍스트 */}
      <div className="absolute left-4 bottom-4">
        <p className="text-white/70 text-xs">돌봄 지갑</p>
        <p className="text-white font-semibold text-sm mt-1">**** **** **** 1234</p>
        <p className="text-white/80 text-xs mt-1">{cardNm}</p>
      </div>
    </div>
  );
}