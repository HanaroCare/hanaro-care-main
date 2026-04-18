'use client';

import { motion } from 'framer-motion';
import { Car, Coins, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

const assets = [
  { icon: Home,  label: '보유 주택 정보', threshold: 33  },
  { icon: Car,   label: '차량 정보',       threshold: 66  },
  { icon: Coins, label: '금 자산',          threshold: 100 },
];

export default function UnifiedLoadingStep({
  onComplete,
  name,
}: {
  onComplete: () => void;
  name?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
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

  return (
    <div className="flex h-full flex-col bg-[#F4FBFC] px-6 pt-16 pb-12">
      {/* 헤딩 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="mb-2 font-medium text-[14px] text-hana-teal-500">통합 자산 분석</p>
        <h2 className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-tight tracking-tight">
          {`${name ?? '사용자'}님의\n자산 정보를 분석 중입니다`}
        </h2>
      </motion.div>

      {/* 프로그레스 바 */}
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-[13px] text-hana-black-500">전체 분석 진행률</span>
          <motion.span
            className="font-bold text-[14px] text-hana-teal-500"
            key={progress}
          >
            {progress}%
          </motion.span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-hana-teal-50">
          <div
            className="h-full rounded-full bg-hana-teal-400"
            style={{ width: `${progress}%`, transition: 'width 0.5s ease-out' }}
          />
        </div>
      </div>

      {/* 자산 목록 */}
      <div className="flex flex-col gap-3">
        {assets.map(({ icon: Icon, label, threshold }) => {
          const done = progress >= threshold;
          return (
            <motion.div
              key={label}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
                done
                  ? 'border-hana-teal-200 bg-hana-teal-50'
                  : 'border-border-gray bg-white'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  done ? 'bg-hana-teal-400' : 'bg-hana-silver-100'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-300 ${
                    done ? 'text-white' : 'text-hana-black-400'
                  }`}
                />
              </div>
              <span
                className={`font-medium text-[15px] transition-colors duration-300 ${
                  done ? 'text-hana-teal-700' : 'text-hana-black-500'
                }`}
              >
                {label}
              </span>
              {done && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-auto font-semibold text-[13px] text-hana-teal-500"
                >
                  완료
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
