import { ChevronRight } from 'lucide-react';
import type { InsuranceDto } from '../../myApi';
import InsuranceLogo from './InsuranceLogo';

interface InsuranceCardProps {
  item: InsuranceDto;
  onClick?: () => void;
}

export default function InsuranceCard({ item, onClick }: InsuranceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <InsuranceLogo img={item.instNm} />
      <div className="min-w-0 flex-1">
        {/* item.company -> item.instNm (보험사명) */}
        <p className="text-gray-400 text-xs">{item.instNm}</p>

        {/* item.name -> item.accountNm (상품명) */}
        <p className="truncate font-bold text-[15px] text-gray-900">
          {item.accountNm}
        </p>

        <p className="mt-0.5 font-medium text-hana-ez-600 text-xs">
          {item.username}님의 보험
        </p>

        {/* item.monthlyPremium -> item.monthlyPremAmt (월 보험료) */}
        <p className="mt-0.5 text-gray-500 text-xs">
          월 {item.monthlyPremAmt.toLocaleString()}원
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 font-medium text-sm text-teal-600">
        <span>확인하기</span>
        <ChevronRight size={16} />
      </div>
    </button>
  );
}
