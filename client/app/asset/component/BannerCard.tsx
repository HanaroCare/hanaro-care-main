// components/BannerCard.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

type BannerCardProps = {
  title: ReactNode;
  buttonText: string;
  imageSrc: string;
  isClosable?: boolean;
  onClick?: () => void;
};

export function BannerCard({
  title,
  buttonText,
  imageSrc,
  isClosable = false,
  onClick,
}: BannerCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative flex h-61.75 w-81.25 flex-col justify-end overflow-hidden rounded-4xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
        style={{
          background:
            'linear-gradient(135deg, #ffffff 0%, rgba(7, 101, 101, 0.15) 100%)',
          border: '1px solid rgba(7, 101, 101, 0.1)',
        }}
      >
        {isClosable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute top-4 right-4 z-50 flex size-6 items-center justify-center rounded-full bg-white/50 outline-none backdrop-blur-sm transition-colors hover:bg-white"
          >
            <X size={9} className="text-hana-black-500" />
          </button>
        )}

        <div className="pointer-events-none absolute top-3.5 right-2.5 h-34.75 w-34">
          <div className="absolute inset-0 rounded-full bg-hana-green-500/10 blur-3xl" />
          <Image
            src={imageSrc}
            alt=""
            width={136}
            height={139}
            className="h-full w-full object-contain opacity-90 transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="whitespace-pre-line font-bold text-[19px] text-hana-black-800 leading-[1.3] tracking-tight">
            {title}
          </h2>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, backgroundColor: '#007575' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="flex h-10.25 w-full items-center justify-center rounded-[13px] bg-hana-green-700 font-semibold text-[14px] text-white shadow-[0_8px_16px_rgba(0,132,133,0.1)] transition-colors"
          >
            {buttonText}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
