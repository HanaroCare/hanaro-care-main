"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { X } from "lucide-react";
import Header from "@/components/navigation/Header";
import ConsentIntro from "@/app/future/components/ConsentIntro";

const faqItems = [
  {
    question: "장기기증이 뭔가요?",
    answer:
      "뇌사 또는 사망 후 다른 사람의 생명을 살리기 위해 장기를 기증하는 것입니다.",
  },
  {
    question: "어떤 장기를 기증할 수 있나요?",
    answer: "신장, 간장, 심장, 폐, 췌장, 소장, 안구 등을 기증할 수 있습니다.",
  },
  {
    question: "언제 이루어지나요?",
    answer: "뇌사 판정 후 또는 심장사 후에 이루어지며, 가족 동의가 필요합니다.",
  },
  {
    question: "기증하면 몸이 훼손되지 않나요?",
    answer:
      "의료진이 최대한 존엄하게 처리하며, 외관상 큰 변화 없이 진행됩니다.",
  },
];

export default function OrganDonationPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Header title="새생명 나눔" />
      <ConsentIntro
        videoSubtitle="실제 장기 기증 절차"
        videoTitle="영상으로 알아보기"
        faqItems={faqItems}
        consultHref={"/future/organ-donation/consult" as Route}
        applyHref={"/future/organ-donation/consult" as Route}
        applyLabel="신청서 작성하기"
        onApplyClick={() => setShowPopup(true)}
      />

      {/* 팝업 */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-3xl w-[283px] px-[16px] pt-[50px] pb-[20px]">
            {/* 닫기 */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-[17px] right-[16px]"
            >
              <X size={20} color="#3E454C" />
            </button>

            {/* 텍스트 */}
            <div className="flex flex-col items-center gap-[8px] mb-[24px]">
              <span className="font-medium text-[16px] leading-[24px] tracking-[-0.04em] text-[#22262B]">
                신청 방법을 선택해주세요
              </span>
              <p className="font-medium text-[12px] leading-[18px] tracking-[-0.04em] text-[#535C6A] text-center">
                신청서를 작성하고 방문할 수 있어요.
              </p>
            </div>

            {/* 버튼 */}
            <button
              onClick={() => {
                setShowPopup(false);
                router.push("/future/organ-donation/delivery" as Route);
              }}
              className="w-full h-[61px] rounded-[10px] font-semibold text-[14px] leading-[20px] tracking-[-0.15px] text-white"
              style={{ backgroundColor: "#01A5AC" }}
            >
              신청서 작성 후 방문
            </button>
          </div>
        </div>
      )}
    </>
  );
}
