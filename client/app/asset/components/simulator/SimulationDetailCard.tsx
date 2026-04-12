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
      className="flex w-full flex-col gap-[20px] rounded-[16px] border border-[#F3F4F6] bg-white px-5 py-[22px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      {items.map((item, index) => {
        const clampedProgress = Math.min(1, Math.max(0, item.progress));
        return (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="font-medium text-[#111827] text-[15px]">
                {item.label}
              </span>
              <span className="font-medium text-[#111827] text-[15px]">
                {item.amount}
              </span>
            </div>
            <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#EAECEE]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clampedProgress * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full bg-[#49A5A4]"
                style={{ opacity: item.opacity }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
