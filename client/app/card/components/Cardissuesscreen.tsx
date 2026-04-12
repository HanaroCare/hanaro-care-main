import CardView from "./Cardview";

interface CardIssueScreenProps {
  onIssue: () => void;
}

export default function CardIssueScreen({ onIssue }: CardIssueScreenProps) {
  return (
    <div
      className="relative flex flex-col w-[375px] min-h-[812px]"
      style={{ background: "linear-gradient(161.91deg, #F0FDFA 0%, #EFF6FF 28.72%, #ECFEFF 57.43%)" }}
    >
      {/* 상단 텍스트 */}
      <div className="absolute left-6 top-[68px]">
        <p className="text-xs text-[#6A7282]">요양보호사 선불카드</p>
      </div>

      <div className="absolute left-6 top-[90px]">
        <h1 className="text-xl font-semibold leading-[30px] tracking-tight text-black whitespace-pre-line">
          {"요양보호사 지출을\n안전하게 관리해요"}
        </h1>
      </div>

      <div className="absolute left-6 top-[159px]">
        <p className="text-xs text-[#4A5565] leading-5 whitespace-pre-line">
          {"선불 충전 방식으로\n이상 지출을 실시간으로 감지해요"}
        </p>
      </div>

      {/* 카드 */}
      <div className="absolute left-14 top-[292px]">
        <CardView cardNm="" />
      </div>

      {/* 발급 버튼 */}
      <button
        onClick={onIssue}
        className="absolute h-[53px] rounded-xl text-white text-base font-medium bg-[#01A5AC] hover:bg-[#019099] transition-colors"
        style={{ width: "327px", left: "calc(50% - 327px/2 + 1px)", top: "703px" }}
      >
        카드 발급하기
      </button>
    </div>
  );
}