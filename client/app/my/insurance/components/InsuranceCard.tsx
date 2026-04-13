import { ChevronRight } from 'lucide-react';
import { viewMode } from '../constants/data';
import InsuranceLogo from '../constants/InsuranceLogo';
import type { InsuranceItem } from '../types';

interface InsuranceCardProps {
  item: InsuranceItem;
  onClick?: () => void;
}

export default function InsuranceCard({ item, onClick }: InsuranceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <InsuranceLogo />
      <div className="min-w-0 flex-1">
        <p className="text-gray-400 text-xs">{item.company}</p>
        <p className="font-bold text-[15px] text-gray-900">{item.name}</p>
        {viewMode === 'GRANTEE' && (
          <p className="mt-0.5 font-medium text-hana-ez-600 text-xs">
            parent님의 보험
          </p>
        )}
        <p className="mt-0.5 text-gray-500 text-xs">{item.monthlyPremium}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 font-medium text-sm text-teal-600">
        <span>확인하기</span>
        <ChevronRight size={16} />
      </div>
    </button>
  );
}
