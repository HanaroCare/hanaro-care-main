'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

type HousingPensionStatusCardProps = {
  hasPlan: boolean;
  amount?: string;
  status?: string;
  onAction?: () => void;
};

export function HousingPensionStatusCard({
  hasPlan,
  amount,
  status,
  onAction,
}: HousingPensionStatusCardProps) {
  if (!hasPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onAction}
        className="flex w-full cursor-pointer items-center justify-between rounded-[24px] border border-dashed border-[#D1D5DB] bg-gray-50/50 p-6 transition-all hover:bg-gray-50"
      >
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-[#4B5563] text-[15px]">
            하나은행 주택연금 설계해보러 갈까요?
          </h4>
          <p className="text-[#9CA3AF] text-[12px]">
            내 집에 살면서 매달 안정적인 생활비를 받아보세요.
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
          <ChevronRight size={20} className="text-hana-green-700" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onAction}
      className="flex w-full cursor-pointer flex-col gap-4 rounded-[24px] border border-[#F3F4F6] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-blue-50">
          <Home size={18} className="text-blue-600" />
        </div>
        <h4 className="font-bold text-[#1F2937] text-[16px]">하나 주택연금</h4>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-[#6B7280] text-[13px]">예상 수령액</p>
        <p className="font-bold text-blue-600 text-[22px]">{amount}</p>
      </div>

      <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-4">
        <span className="font-medium text-[#9CA3AF] text-[13px]">상태</span>
        <span className="font-semibold text-blue-600 text-[13px]">{status}</span>
      </div>
    </motion.div>
  );
}
