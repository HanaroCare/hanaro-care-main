"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "@/components/LoginHeader";
import AuthInput from "../components/AuthInput";
import PrimaryButton from "@/components/PrimaryButton";

/**
 * 아이디 찾기 페이지
 */
export default function FindIdPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const isFormValid = name.length > 0 && phone.length >= 10;

  const handleFindId = () => {
    if (isFormValid) {
      console.log("Find ID for:", { name, phone });
      router.push("/login/find-id/result");
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <LoginHeader title="아이디 찾기" />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              등록된 정보로
              <br />
              아이디를 찾아보세요
            </h2>
          </div>

          <div className="flex flex-col gap-[1.25rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">이름</label>
              <AuthInput
                id="name"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">휴대폰 번호</label>
              <AuthInput
                id="phone"
                type="tel"
                placeholder="'-' 없이 숫자만 입력"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-auto pb-[3rem]">
            <PrimaryButton
              label="아이디 찾기"
              disabled={!isFormValid}
              onClick={handleFindId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
