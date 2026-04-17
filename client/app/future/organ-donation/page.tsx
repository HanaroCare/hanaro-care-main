"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
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
        videoSrc="https://www.youtube.com/embed/YaSCigPmokU?playsinline=1&rel=0"
        consultHref={"tel:02-2628-3602" as Route}
        applyHref={"/future/organ-donation/delivery" as Route}
        applyLabel="신청서 작성하기"
        onApplyClick={() => setShowPopup(true)}
      />
    </>
  );
}
