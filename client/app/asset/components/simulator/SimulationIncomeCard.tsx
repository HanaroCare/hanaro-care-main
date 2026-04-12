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
      className="flex w-full flex-col rounded-[24px] border border-hana-silver-100 bg-white px-6 py-[26px] shadow-sm"
    >
      <div className="flex flex-col gap-[22px]">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[16px] text-hana-black-900">
                {item.label}
              </span>
              <span className="font-bold text-[20px] text-hana-green-700">
                {item.amount}
              </span>
            </div>
            {(item.subLabel || item.subLabel2) && (
              <div className="flex items-center justify-between text-[13px] text-hana-black-500 opacity-60">
                <span>{item.subLabel}</span>
                <span>{item.subLabel2}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="my-[22px] h-px w-full bg-hana-silver-100" />

      <div className="mb-4 flex items-center justify-between font-medium text-[14px] text-hana-black-500">
        <span>활용 가능 금융 자산</span>
        <span>월 가용 금액</span>
      </div>

      <div className="flex h-[72px] w-full items-center justify-center rounded-[16px] bg-hana-green-50">
        <span className="font-bold text-[28px] text-hana-green-700">
          {totalAvailable}
        </span>
      </div>
    </motion.div>
  );
}
