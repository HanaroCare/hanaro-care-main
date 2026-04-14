'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';

type TrustStatusCardProps = {
  trustName: string;
  totalAmount: string;
  contractStatus: string;
  onAction?: () => void;
};

export function TrustStatusCard({
  trustName,
  totalAmount,
  contractStatus,
  onAction,
}: TrustStatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onAction}
      className="flex w-full cursor-pointer flex-col gap-5 rounded-[24px] border border-[#F3F4F6] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-hana-green-50">
            <ShieldCheck size={20} className="text-hana-green-700" />
          </div>
          <h4 className="font-bold text-[#1F2937] text-[16px]">{trustName}</h4>
        </div>
        <ChevronRight size={20} className="text-[#9CA3AF]" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-medium text-[#6B7280] text-[13px]">현재 신탁 자산</p>
        <p className="font-bold text-hana-green-700 text-[24px]">{totalAmount}</p>
      </div>

      <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-4">
        <span className="font-medium text-[#9CA3AF] text-[13px]">상태</span>
        <span className="font-semibold text-hana-green-700 text-[13px]">
          {contractStatus}
        </span>
      </div>
    </motion.div>
  );
}
