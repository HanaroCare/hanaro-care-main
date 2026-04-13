'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

/**
 * 시안 디자인을 반영한 최종 완료 화면
 */
export default function CompleteStep() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[6rem] pb-[3rem]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-[1.5rem] text-primary"
      >
        <CheckCircle2 size={48} strokeWidth={2} />
      </motion.div>

      <div className="flex flex-col">
        <h2 className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
          금융 자산을
          <br />다 불러왔어요!
        </h2>
      </div>

      <div className="mt-auto w-full">
        <PrimaryButton label="확인하기" onClick={() => router.push('/asset')} />
      </div>
    </div>
  );
}
