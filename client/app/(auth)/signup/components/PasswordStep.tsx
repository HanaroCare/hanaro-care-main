"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { validatePassword, validatePasswordMatch } from "../utils/validators";

interface PasswordStepProps {
  isActive: boolean;
  onComplete: (val: string) => void;
  isLoading?: boolean;
  externalError?: string;
}

export default function PasswordStep({ isActive, onComplete, isLoading = false, externalError }: PasswordStepProps) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const confirmRef = useRef<HTMLInputElement>(null);

  const displayError = externalError || error;

  const handleKeyDown = (e: React.KeyboardEvent, type: "pw" | "confirm") => {
    if (e.key === "Enter" && !isLoading) {
      if (type === "pw") {
        if (!validatePassword(pw)) {
          setError("8~16자, 영문과 숫자를 포함해주세요.");
          return;
        }
        setError("");
        confirmRef.current?.focus();
      }

      if (type === "confirm") {
        if (!validatePassword(pw)) {
          setError("비밀번호 정책에 맞지 않습니다. 다시 설정해주세요.");
          return;
        }
        if (validatePasswordMatch(pw, confirm)) {
          onComplete(pw);
        } else {
          setError("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        }
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-[0.75rem] ${isActive ? "opacity-100" : "opacity-30"}`}
    >
      <div className="flex flex-col gap-[0.375rem]">
        <label className="text-[1.1rem] font-bold text-gray-900 leading-tight px-[0.125rem]">
          비밀번호를 설정해주세요
        </label>
        <p className="text-[0.75rem] font-medium text-gray-500 px-[0.125rem] mb-[0.25rem]">
          8~16자, 영문과 숫자를 포함해주세요 (특수문자 @$!%*#?& 사용 가능)
        </p>

        <div className="flex flex-col gap-[0.5rem]">
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value.trimEnd()); setError(""); }}
            onKeyDown={(e) => handleKeyDown(e, "pw")}
            disabled={!isActive || isLoading}
            placeholder="비밀번호 입력"
            className={`w-full h-[3rem] rounded-xl border-[0.125rem] bg-gray-50 px-[0.875rem] text-[0.9rem] font-semibold outline-none transition-all ${isActive && !isLoading ? "border-hana-ez-600 bg-white shadow-sm" : "border-gray-100"
              }`}
          />
          <input
            ref={confirmRef}
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value.trimEnd()); setError(""); }}
            onKeyDown={(e) => handleKeyDown(e, "confirm")}
            disabled={!isActive || pw.length < 8 || isLoading}
            placeholder="비밀번호 확인"
            className={`w-full h-[3rem] rounded-xl border-[0.125rem] bg-gray-50 px-[0.875rem] text-[0.9rem] font-semibold outline-none transition-all ${isActive && !isLoading ? "border-hana-ez-600 bg-white shadow-sm" : "border-gray-100"
              }`}
          />
        </div>
        {displayError && !isLoading && (
          <p className="text-[0.75rem] font-medium text-red-500 mt-1 px-[0.125rem] animate-in fade-in slide-in-from-top-1">
            {displayError}
          </p>
        )}
        {isLoading && (
          <p className="text-[0.75rem] font-medium text-hana-ez-600 mt-1 px-[0.125rem]">
            처리 중...
          </p>
        )}
      </div>
    </motion.div>
  );
}
