'use client';

import { motion } from 'framer-motion';

type IncomeItem = {
  label: string;
  amount: string;
  subLabel?: string;
  subLabel2?: string;
};

type SimulationIncomeCardProps = {
  items: IncomeItem[];
  totalAvailable: string;
};

export function SimulationIncomeCard({
  items,
  totalAvailable,
}: SimulationIncomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col rounded-[24px] border border-[#F3F4F6] bg-white px-6 py-[26px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-col gap-[22px]">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#111827] text-[16px]">
                {item.label}
              </span>
              <span className="font-bold text-[20px] text-hana-green-700">
                {item.amount}
              </span>
            </div>
            {(item.subLabel || item.subLabel2) && (
              <div className="flex items-center justify-between text-[#9CA3AF] text-[13px]">
                <span>{item.subLabel}</span>
                <span>{item.subLabel2}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="my-[22px] h-px w-full bg-[#F3F4F6]" />

      <div className="mb-4 flex items-center justify-between font-medium text-[#6B7280] text-[14px]">
        <span>활용 가능 금융 자산</span>
        <span>월 가용 금액</span>
      </div>

      <div className="flex h-[72px] w-full items-center justify-center rounded-[16px] bg-[#F0FDFA]">
        <span className="font-bold text-[28px] text-hana-green-700">
          {totalAvailable}
        </span>
      </div>
    </motion.div>
  );
}
