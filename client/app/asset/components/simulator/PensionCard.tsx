'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

type PensionCardProps = {
  title: string;
  amount: string;
  status: string;
  onAction?: () => void;
};

export function PensionCard({
  title,
  amount,
  status,
  onAction,
}: PensionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col gap-5 rounded-[24px] border border-[#F3F4F6] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-col gap-1.5">
        <h4 className="font-medium text-[#4B5563] text-[16px]">{title}</h4>
        <p className="font-bold text-[#00A8A6] text-[28px]">{amount}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="rounded-full bg-[#F0FDFA] px-4 py-2 font-semibold text-[#00A8A6] text-[13px]">
          {status}
        </div>
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-0.5 font-medium text-[#9CA3AF] text-[14px] transition-colors hover:text-[#6B7280]"
        >
          확인하기 <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
