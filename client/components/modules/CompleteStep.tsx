'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface CompleteStepProps {
  icon?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function CompleteStep({
  icon,
  footer,
  children,
  className = '',
}: CompleteStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex min-h-dvh w-full flex-col bg-white px-7 pt-32 pb-10 ${className}`}
    >
      <div className="flex flex-1 flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
            delay: 0.2,
          }}
          className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-hana-ez-50"
        >
          {icon ?? (
            <CheckCircle2
              className="h-[4.5rem] w-[4.5rem] text-hana-ez-600"
              strokeWidth={2.5}
            />
          )}
        </motion.div>

        {children}
      </div>

      <div className="flex w-full flex-col gap-3">{footer}</div>
    </motion.div>
  );
}
