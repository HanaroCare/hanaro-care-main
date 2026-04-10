/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export function MedicalBillCard() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="group relative flex h-61.75 w-81.25 flex-col justify-end overflow-hidden rounded-4xl p-6"
        style={{
          background:
            'linear-gradient(135deg, #ffffff 0%, rgba(7, 101, 101, 0.2) 100%)',
          border: '1px solid rgba(7, 101, 101, 0.1)',
        }}
      >
        <button
          type="button" // 기본 동작 방지
          onClick={() => setIsVisible(false)}
          // border-none(테두리 삭제), outline-none(클릭 시 테두리 삭제) 추가
          className="absolute top-4 right-4 z-50 flex size-6 items-center justify-center rounded-full border-none bg-white/50 outline-none backdrop-blur-sm transition-colors hover:bg-white"
          aria-label="Close"
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* User provided path */}
            <path
              d="M0.5 0.5L7.93083 7.93083"
              stroke="#5E707C"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.93083 0.5L0.5 7.93083"
              stroke="#5E707C"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="pointer-events-none absolute top-3.5 left-40.75 h-34.75 w-34">
          <div className="absolute inset-0 rounded-full bg-hana-green-500/10 blur-3xl" />
          <Image
            src="/images/asset/medical-icon.svg"
            alt="Medical Icon"
            width={136}
            height={139}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="whitespace-pre-line font-bold text-[#3E454C] text-[19px] leading-6 tracking-tight">
            내 남은 인생,{'\n'}평생 병원비 걱정 없을까요?
          </h2>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#007575' }}
            whileTap={{ scale: 0.98 }}
            className="flex h-10.25 w-full items-center justify-center rounded-[13px] bg-hana-green-700 font-semi-bold text-[14px] text-white shadow-[0_10px_20px_rgba(0,132,133,0.15)] transition-colors"
          >
            병원비 계산하기
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
