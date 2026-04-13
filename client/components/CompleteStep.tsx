"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import PrimaryButton from "./baseelements/PrimaryButton";

interface CompleteStepProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function CompleteStep({
  title,
  description,
  buttonText,
  onButtonClick,
}: CompleteStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-[2rem] text-center"
    >
      <motion.div
        initial={{ scale: 0.5, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="mb-[3rem] flex h-[10rem] w-[10rem] items-center justify-center rounded-full bg-hana-ez-50"
      >
        <CheckCircle2
          className="h-[4.5rem] w-[4.5rem] text-hana-ez-600"
          strokeWidth={2.5}
        />
      </motion.div>
      <h2 className="text-[1.75rem] font-bold text-gray-900 mb-[1rem] leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-[1.125rem] text-gray-500 mb-[4rem] leading-relaxed whitespace-pre-line">
        {description}
      </p>
      <div className="w-full max-w-[18.75rem]">
        <PrimaryButton
          label={buttonText}
          onClick={onButtonClick}
          className="shadow-2xl shadow-hana-ez-600/20"
        />
      </div>
    </motion.div>
  );
}
