"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  isActive: boolean;
  onComplete: (val: string) => void;
  error?: string;
  isLoading?: boolean;
  onReset?: () => void;
}

export default function OTPInput({ isActive, onComplete, error, isLoading = false, onReset }: OTPInputProps) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(300);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(300);
      inputs.current[0]?.focus();
      const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [isActive]);

  useEffect(() => {
    if (error) {
      setOtp(new Array(6).fill(""));
      inputs.current[0]?.focus();
    }
  }, [error]);

  const handleChange = (val: string, index: number) => {
    if (isNaN(Number(val)) || isLoading) return;
    onReset?.();
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) inputs.current[index + 1]?.focus();
    if (newOtp.every((v) => v !== "")) onComplete(newOtp.join(""));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-[0.75rem] ${isActive ? "opacity-100" : "opacity-30"}`}>
      <label className="text-[1.1rem] font-bold text-gray-900 leading-tight px-[0.125rem] whitespace-pre-line">
        전화번호로 받은{"\n"}인증번호를 입력해주세요
      </label>
      <div className="flex gap-[0.4rem] justify-between">
        {otp.map((data, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            ref={(el) => { inputs.current[i] = el; }}
            value={data}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            disabled={!isActive || isLoading}
            className={`w-[2.6rem] h-[3rem] rounded-xl border-[0.125rem] text-center text-[1rem] font-bold text-gray-900 outline-none transition-all ${isLoading
              ? "border-hana-ez-600/40 bg-gray-50 text-gray-400"
              : error
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-gray-100 bg-gray-50 focus:border-hana-ez-600 focus:bg-white"
              }`}
          />
        ))}
      </div>
      {isActive && isLoading && (
        <p className="text-[0.75rem] font-medium text-hana-ez-600 ml-[0.25rem]">확인 중...</p>
      )}
      {isActive && error && !isLoading && (
        <p className="text-[0.75rem] font-medium text-red-500 ml-[0.25rem] animate-in fade-in slide-in-from-top-1">{error}</p>
      )}
      {isActive && !isLoading && !error && (
        <p className="text-[0.75rem] font-medium text-red-500 ml-[0.25rem]">남은시간 {formatTime(timeLeft)}</p>
      )}
    </motion.div>
  );
}
