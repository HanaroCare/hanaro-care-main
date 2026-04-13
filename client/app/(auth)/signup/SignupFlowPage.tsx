"use client";

import { useState, KeyboardEvent } from "react";
import { AnimatePresence } from "framer-motion";
import InputStep from "./components/InputStep";
import OTPInput from "./components/OTPInput";
import PasswordStep from "./components/PasswordStep";
import CompleteStep from "@/components/CompleteStep";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    key: "name",
    question: "이름을 입력해주세요",
    description: "실명 확인을 위해 한글 또는 영문으로 입력해주세요",
    placeholder: "ex) 홍길동",
    type: "text"
  },
  {
    key: "age",
    question: "나이를 입력해주세요",
    description: "본인 확인을 위해 나이를 입력해주세요",
    placeholder: "예시) 25",
    type: "number"
  },
  {
    key: "phone",
    question: "휴대폰 번호를 입력해주세요",
    description: "'-' 없이 숫자 11자리를 입력해주세요",
    placeholder: "01012345678",
    type: "tel"
  },
  { key: "otp" },
  { key: "password" },
];

export default function SignupFlowPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [maxIdx, setMaxIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const router = useRouter();

  const handleNext = () => {
    if (currentIdx < STEPS.length - 1) {
      setCurrentIdx((prev) => {
        const next = prev + 1;
        if (next > maxIdx) setMaxIdx(next);
        return next;
      });
    } else {
      setIsFinished(true);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentIdx(index);
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEdit(index);
    }
  };

  if (isFinished) {
    return (
      <CompleteStep
        title="가입이 완료되었어요!"
        description={`이제 하나케어의 특별한\n자산 관리 서비스를 시작해보세요.`}
        buttonText="시작하기"
        onButtonClick={() => {
          localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
          router.push("/login");
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white max-w-[23.4375rem] mx-auto overflow-hidden shadow-sm">
      {/* <Header title="회원가입" /> */}

      <main className="flex-1 flex flex-col gap-[2.5rem] px-[1.25rem] pt-[1.5rem] pb-[5rem] overflow-y-auto no-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {STEPS.slice(0, maxIdx + 1).reverse().map((step, idx) => {
            const actualIdx = maxIdx - idx;
            const isActive = actualIdx === currentIdx;

            if (step.key === "otp") return (
              <div
                key="otp"
                role="button"
                tabIndex={!isActive ? 0 : -1}
                className={`transition-all duration-300 outline-none ${!isActive
                  ? "opacity-40 hover:opacity-100 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                  : ""
                  }`}
                onClick={() => !isActive && handleEdit(actualIdx)}
                onKeyDown={(e) => !isActive && handleKeyDown(e, actualIdx)}
              >
                <OTPInput
                  isActive={isActive}
                  onComplete={(val) => {
                    setFormData((prev) => ({ ...prev, otp: val }));
                    handleNext();
                  }}
                />
              </div>
            );

            if (step.key === "password") return (
              <div
                key="password"
                role="button"
                tabIndex={!isActive ? 0 : -1}
                className={`transition-all duration-300 outline-none ${!isActive
                  ? "opacity-40 hover:opacity-100 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                  : ""
                  }`}
                onClick={() => !isActive && handleEdit(actualIdx)}
                onKeyDown={(e) => !isActive && handleKeyDown(e, actualIdx)}
              >
                <PasswordStep
                  isActive={isActive}
                  onComplete={(val) => {
                    setFormData((prev) => ({ ...prev, password: val }));
                    handleNext();
                  }}
                />
              </div>
            );

            return (
              <InputStep
                key={step.key}
                question={step.question!}
                description={(step as any).description}
                placeholder={step.placeholder}
                type={step.type}
                value={formData[step.key] || ""}
                onChange={(val) => setFormData(prev => ({ ...prev, [step.key]: val }))}
                onSubmit={handleNext}
                onEdit={() => handleEdit(actualIdx)}
                isActive={isActive}
                isFocused={isActive}
              />
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
}