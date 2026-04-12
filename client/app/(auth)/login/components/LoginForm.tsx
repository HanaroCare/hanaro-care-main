"use client";

import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import AuthInput from "./AuthInput";

type LoginFormProps = {
  onSubmit: (data: { id: string; pw: string }) => void;
};

/**
 * 일반 로그인 폼 컴포넌트
 */
export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const isFormValid = userId.length > 0 && userPw.length > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({ id: userId, pw: userPw });
    }
  };

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <div className="flex flex-col gap-[0.75rem]">
        <AuthInput
          id="userId"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <AuthInput
          id="userPw"
          placeholder="비밀번호 입력"
          type="password"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
        />
      </div>

      <PrimaryButton
        label="로그인하기"
        disabled={!isFormValid}
        onClick={handleSubmit}
      />
    </div>
  );
}
