'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useEffect } from 'react';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  // 스크롤 잠금 (UX 디테일)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 w-full max-w-93.75 rounded-t-[20px] bg-white px-6 pt-2 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
          >
            <div className="flex justify-center pt-2 pb-6">
              <div className="h-1.5 w-10 rounded-full bg-hana-silver-100" />
            </div>

            <div className="no-scrollbar max-h-[80dvh] overflow-y-auto pb-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
