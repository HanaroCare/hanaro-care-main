"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { validatePhone } from "../utils/validators";

interface InputStepProps {
  question: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onEdit?: () => void;
  type?: string;
  placeholder?: string;
  isActive: boolean;
  isFocused: boolean;
}

export default function InputStep({
  question, description, value, onChange, onSubmit, onEdit, type = "text", placeholder, isActive, isFocused
}: InputStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isFocused && inputRef.current) inputRef.current.focus();
  }, [isFocused]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim().length > 0) {
      if (type === "tel" && !validatePhone(value)) {
        setError("010으로 시작하는 11자리 숫자를 입력해주세요.");
        return;
      }
      setError("");
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    setError("");

    if (type === "tel") val = val.replace(/[^0-9]/g, "").slice(0, 11);
    else if (question.includes("이름")) val = val.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
    else if (question.includes("나이") || type === "number") val = val.replace(/[^0-9]/g, "").slice(0, 3);

    onChange(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (type === "tel" && val.length === 11 && isActive) {
      if (validatePhone(val)) {
        timerRef.current = setTimeout(() => {
          onSubmit();
          timerRef.current = null;
        }, 100);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className={`flex flex-col gap-[0.375rem] transition-all duration-400 ${isActive ? "opacity-100" : "opacity-60 cursor-pointer hover:opacity-100"
        }`}
      onClick={!isActive ? onEdit : undefined}
    >
      <label className={`text-[1.1rem] font-bold leading-tight px-[0.125rem] transition-colors ${isActive ? "text-gray-900" : "text-gray-400"
        }`}>
        {question}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type={type === "tel" ? "text" : type}
          inputMode={type === "tel" || type === "number" ? "numeric" : "text"}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isActive ? placeholder : ""}
          disabled={!isActive}
          className={`w-full h-[3rem] rounded-xl border-[0.125rem] px-[0.875rem] text-[0.9rem] font-semibold outline-none transition-all ${isActive
            ? "border-hana-ez-600 bg-white text-gray-900 ring-[0.2rem] ring-hana-ez-600/5 shadow-sm"
            : "border-gray-100 bg-gray-50 text-gray-400 cursor-pointer"
            }`}
        />
        {!isActive && <div className="absolute inset-0 z-10" />}
      </div>

      {isActive && error && (
        <p className="text-[0.75rem] font-medium text-red-500 mt-1 px-[0.125rem] animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}

      {isActive && description && !error && (
        <p className="text-[0.75rem] font-medium text-gray-500 px-[0.125rem] mt-[0.125rem] animate-in fade-in slide-in-from-top-1">
          {description}
        </p>
      )}
    </motion.div>
  );
}
