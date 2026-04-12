import { ChevronLeft, Bell, Settings } from "lucide-react";
import { CardData, UsageData } from "../hooks/useCard";
import CardView from "./Cardview";
import UsageList from "./Usagelist";

interface CardDashboardScreenProps {
  card: CardData;
  usages: UsageData[];
  onAddCard: () => void;
}

export default function CardDashboardScreen({ card, usages, onAddCard }: CardDashboardScreenProps) {
  const monthlyTotal = usages.reduce((sum, u) => sum + u.usageAmt, 0);

  return (
    <div className="relative w-[375px] min-h-[812px] bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10">
        <button className="p-1">
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 관리</span>
        <button className="p-1">
          <Bell size={24} color="#0A0A0A" />
        </button>
      </div>

      {/* 카드 영역 */}
      <div className="absolute w-[325px] h-[378px] left-6 top-[82px] bg-[#F6F7F8]/50 rounded-[30px]">
        {/* 카드 */}
        <div className="absolute left-7 top-[74px]">
          <CardView cardNm={card.cardNm} />
        </div>

        {/* 카드 이름 */}
        <p className="absolute left-[85px] top-[254px] text-xl font-semibold tracking-tight text-[#3E454C]">
          {card.cardNm}
        </p>

        {/* 잔액 */}
        <p className="absolute left-7 top-[301px] text-sm text-[#5E707C]">잔액</p>
        <p className="absolute left-7 top-[322px] text-base font-semibold tracking-tight text-[#3E454C]">
          {card.balance.toLocaleString()}원
        </p>

        {/* 송금하기 */}
        <button className="absolute right-7 top-[303px] px-3 py-1 bg-[#EEFFFC] rounded-[15px] text-xs font-medium text-[#01A5AC]">
          송금하기
        </button>
      </div>

      {/* 바텀시트 */}
      <div
        className="absolute w-[375px] top-[513px] bg-white rounded-t-[20px] pb-24"
        style={{ boxShadow: "0px -4px 20px rgba(0,0,0,0.15)" }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>

        {/* 월 소비 */}
        <div className="px-6 mt-6">
          <p className="text-xl font-medium text-[#101828] tracking-tight">4월 소비 내역</p>
          <p className="text-2xl font-medium text-[#101828] tracking-tight mt-1">
            {monthlyTotal.toLocaleString()}원
          </p>
        </div>

        {/* 지출 내역 */}
        <div className="px-[34px] mt-6">
          <UsageList usages={usages} cardNm={card.cardNm} />
        </div>

        {/* 카드 설정 변경 */}
        <div className="flex justify-end px-6 mt-6">
          <button className="flex items-center gap-1 px-3 py-1 bg-[#EDEFF1] rounded-xl text-xs font-medium text-black">
            <Settings size={14} />
            카드 설정 변경
          </button>
        </div>
      </div>

      {/* 추가 발급 버튼 */}
      <button
        onClick={onAddCard}
        className="fixed bottom-6 h-[53px] rounded-xl text-white text-base font-medium bg-[#01A5AC] hover:bg-[#019099] transition-colors"
        style={{ width: "327px", left: "calc(50% - 327px/2)" }}
      >
        + 카드 추가 발급
      </button>
    </div>
  );
}