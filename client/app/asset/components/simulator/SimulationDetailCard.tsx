'use client';

import { motion } from 'framer-motion';

type SimulationDetailItem = {
  label: string;
  amount: string;
  progress: number; // 0 to 1
  opacity: number;
};

type SimulationDetailCardProps = {
  items: SimulationDetailItem[];
};

export function SimulationDetailCard({ items }: SimulationDetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#F3F4F6] bg-white p-5 shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
    >
      <div className="flex flex-col gap-2.5">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-col gap-[7px]">
            <div className="flex items-center justify-between">
              <span className="font-normal text-[14px] text-hana-black-900 leading-[21px] tracking-[-0.28px]">
                {item.label}
              </span>
              <span className="font-normal text-[14px] text-hana-black-900 leading-[21px] tracking-[-0.28px]">
                {item.amount}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full bg-hana-green-700"
                style={{ opacity: item.opacity }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
