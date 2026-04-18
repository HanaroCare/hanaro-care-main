'use client';

import { motion } from 'framer-motion';
import { Car, Coins, Home, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const assetIconMap: Record<string, LucideIcon> = {
  house: Home,
  car:   Car,
  gold:  Coins,
};

const assetLabelMap: Record<string, string> = {
  house: '주택 정보를 갱신 중이에요',
  car:   '차량 정보를 갱신 중이에요',
  gold:  '금 보유 현황을 안전하게\n불러오고 있습니다',
};

export default function LoadingStep({
  onComplete,
  name,
  assetType,
}: {
  onComplete: () => void;
  name?: string;
  assetType?: 'house' | 'car' | 'gold';
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // ~1.75× faster than original (was 60ms/+3/+2/+1)
        const increment = prev < 30 ? 5 : prev < 70 ? 4 : 2;
        const next = Math.min(100, prev + increment);
        if (next === 100) {
          clearInterval(timer);
          timeoutId = setTimeout(onComplete, 600);
        }
        return next;
      });
    }, 40);
    return () => {
      clearInterval(timer);
      clearTimeout(timeoutId);
    };
  }, [onComplete]);

  const AssetIcon = assetType ? assetIconMap[assetType] : null;
  const headingText = assetType
    ? assetLabelMap[assetType]
    : `${name ?? '사용자'}님의 자산을\n연결 중입니다`;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#F4FBFC] px-[1.5rem] pt-[4rem]">
      {/* 배경 fill */}
      <motion.div
        className="absolute right-0 bottom-0 left-0 bg-primary/5"
        initial={{ height: '0%' }}
        animate={{ height: `${progress}%` }}
        transition={{ ease: 'linear' }}
      />

      {/* 헤딩 + % */}
      <div className="relative z-10 flex flex-col">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-tight tracking-tight"
        >
          {headingText}
        </motion.h2>
        <motion.div
          className="mt-[1rem] flex items-baseline gap-[0.25rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-bold text-[1.125rem] text-primary">{progress}%</span>
          <span className="font-medium text-[1.125rem] text-primary/70">완료</span>
        </motion.div>
      </div>

      {/* 아이콘 애니메이션 */}
      <div className="relative z-10 flex flex-1 items-center justify-center pb-[4rem]">
        <div className="relative h-[12rem] w-[12rem]">
          <motion.div
            className="absolute inset-0 rounded-full border-[2px] border-primary/10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-[1rem] rounded-full border-[1px] border-primary/20 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {AssetIcon ? (
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-hana-teal-400"
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(0,132,133,0)',
                    '0 0 0 20px rgba(0,132,133,0.15)',
                    '0 0 0 0 rgba(0,132,133,0)',
                  ],
                }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <AssetIcon size={28} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                className="h-[1.5rem] w-[1.5rem] rounded-full bg-primary"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(0,132,133,0)',
                    '0 0 0 20px rgba(0,132,133,0.1)',
                    '0 0 0 0 rgba(0,132,133,0)',
                  ],
                }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
