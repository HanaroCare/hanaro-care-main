'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

type Props = {
  monthlyPayout: number;   // 주택연금 월 수령액 (원)
  currentShortage: number; // 양수=부족, 음수=여유 (원)
};

function toManwon(won: number): string {
  return `${Math.floor(Math.abs(won) / 10000).toLocaleString()}만원`;
}

export function HousingPensionImpactCard({ monthlyPayout, currentShortage }: Props) {
  const afterShortage = currentShortage - monthlyPayout;
  const afterSufficient = afterShortage <= 0;
  const beforeSufficient = currentShortage <= 0;

  const beforeLabel = beforeSufficient
    ? `${toManwon(currentShortage)} 여유`
    : `${toManwon(currentShortage)} 부족`;

  const afterLabel = afterSufficient
    ? `${toManwon(afterShortage)} 여유`
    : `${toManwon(afterShortage)} 부족`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full items-center gap-4 rounded-[16px] border border-[#F3F4F6] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-hana-green-50">
        <Home size={18} className="text-hana-green-700" />
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="font-medium text-[12px] text-hana-black-500">
          주택연금 월 {toManwon(monthlyPayout)} 수령 효과
        </span>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-[15px] ${beforeSufficient ? 'text-hana-green-700' : 'text-hana-red-500'}`}>
            {beforeLabel}
          </span>
          <span className="text-[13px] text-hana-black-300">→</span>
          <span className={`font-bold text-[15px] ${afterSufficient ? 'text-hana-green-700' : 'text-hana-red-500'}`}>
            {afterLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
