'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';

interface MainFeatureCardProps {
  title: ReactNode;
  buttonText: string;
  imageSrc: string;
}

export function MainFeatureCard({ title, buttonText, imageSrc }: MainFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative flex h-[247px] w-[325px] flex-col justify-end overflow-hidden rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(7, 101, 101, 0.1) 100%)',
        border: '1px solid rgba(7, 101, 101, 0.05)',
      }}
    >
      {/* Decorative Image/Icon Area */}
      <div className="pointer-events-none absolute top-[14px] right-[10px] h-[130px] w-[130px]">
        <div className="absolute inset-0 rounded-full bg-hana-green-500/5 blur-3xl" />
        <Image
          src={imageSrc}
          alt="Feature Icon"
          width={130}
          height={130}
          className="h-full w-full object-contain opacity-90 transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Area */}
      <div className="relative z-10 space-y-5">
        <h2 className="whitespace-pre-line font-bold text-[19px] text-[#3E454C] leading-[26px] tracking-tight">
          {title}
        </h2>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#007575' }}
          whileTap={{ scale: 0.98 }}
          className="flex h-[44px] w-full items-center justify-center rounded-[14px] bg-hana-green-700 font-semibold text-[14px] text-white shadow-[0_8px_16px_rgba(0,132,133,0.1)] transition-colors"
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
}
