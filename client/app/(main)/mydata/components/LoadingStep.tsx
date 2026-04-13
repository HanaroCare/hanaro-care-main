"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 로딩 화면
 */
export default function LoadingStep({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        const increment = prev < 30 ? 3 : prev < 70 ? 2 : 1;
        return prev + increment;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#F4FBFC] px-[1.5rem] pt-[4rem]">

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-primary/5"
        initial={{ height: "0%" }}
        animate={{ height: `${progress}%` }}
        transition={{ ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[1.5rem] font-bold leading-tight tracking-tight text-foreground"
        >
          하나님의 정보를
          <br />
          불러오고 있어요
        </motion.h2>

        <motion.div
          className="mt-[1rem] flex items-baseline gap-[0.25rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-[1.125rem] font-bold text-primary">
            {progress}%
          </span>
          <span className="text-[1.125rem] font-medium text-primary/70">
            완료
          </span>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center pb-[4rem]">
        <div className="relative h-[12rem] w-[12rem]">
          <motion.div
            className="absolute inset-0 rounded-full border-[2px] border-primary/10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-[1rem] rounded-full border-[1px] border-dashed border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-[1.5rem] w-[1.5rem] rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: ["0 0 0 0 rgba(0,132,133,0)", "0 0 0 20px rgba(0,132,133,0.1)", "0 0 0 0 rgba(0,132,133,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
