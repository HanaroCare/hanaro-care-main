'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

export default function IntroStep({
  onConfirm,
  onCustomMode,
  name,
}: {
  onConfirm: () => void;
  onCustomMode: () => void;
  name?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center px-[1.5rem] pt-[4rem] pb-[3rem]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="mb-[2rem] flex h-[6rem] w-[6rem] items-center justify-center rounded-full bg-hana-ez-50 text-primary"
      >
        <Wallet size={48} />
      </motion.div>

      <div className="mb-[4rem] text-center">
        <h2 className="font-bold text-[1.5rem] text-foreground leading-tight tracking-tight">
          {name || '사용자'}님이 쓰고 있는
          <br />
          자산 정보를 불러올게요
        </h2>
        <p className="mt-[1rem] font-medium text-[1rem] text-muted-foreground">
          은행, 카드, 증권사 정보를 한눈에 관리하세요.
        </p>
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-[1.25rem]">
        <button
          type="button"
          onClick={onCustomMode}
          className="font-medium text-[0.875rem] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          원하는 것만 선택하기
        </button>
        <PrimaryButton label="확인하기" onClick={onConfirm} />
      </div>
    </div>
  );
}
