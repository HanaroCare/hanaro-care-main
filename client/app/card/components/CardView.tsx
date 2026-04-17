const CARD_DESIGN_MAP: Record<string, string> = {
  A: "/images/card/careCard_1.png",
  B: "/images/card/careCard_2.png",
  C: "/images/card/careCard_3.png",
  D: "/images/card/careCard_4.png",
  E: "/images/card/careCard_5.png",
};

interface CardViewProps {
  cardNm: string;
  designCd: string;
}

export default function CardView({ cardNm, designCd }: CardViewProps) {
  const bgImage = CARD_DESIGN_MAP[designCd];

  return (
    <div
      className="relative w-[262px] h-[165px] rounded-xl overflow-hidden"
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              background:
                "linear-gradient(111.45deg, #008485 2.93%, #C5FFFA 98.1%)",
            }
      }
    >
      {!bgImage && (
        <div
          className="absolute w-[79px] h-[79px] rounded-full right-0 bottom-2"
          style={{
            background:
              "linear-gradient(124.87deg, rgba(255,255,255,0.5) 16.85%, rgba(255,255,255,0.25) 84.45%)",
          }}
        />
      )}
      {/* 카드 번호 제거, 카드명만 */}
      <div className="absolute left-4 bottom-4">
        <p className="text-white/70 text-xs">돌봄 지갑</p>
        <p className="text-white/80 text-xs mt-1">{cardNm}</p>
      </div>
    </div>
  );
}
