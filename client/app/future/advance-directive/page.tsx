"use client";

import Header from "@/components/navigation/Header";
import ConsentIntro from "@/app/future/components/ConsentIntro";
import { Route } from "next";

const faqItems = [
  {
    question: "어떤 상황에서 필요하나요?",
    answer:
      "회복 가능성이 없는 임종 과정에서 무의미한 연명치료를 받지 않겠다는 의사를 미리 밝혀두는 것입니다.",
  },
  {
    question: "미리 해두면 뭐가 좋아요?",
    answer:
      "본인의 의사가 존중되고, 가족의 고통스러운 결정 부담을 줄일 수 있어요.",
  },
  {
    question: "연명의료 결정이 뭔가요?",
    answer:
      "임종 과정에 있는 환자가 심폐소생술, 인공호흡기 등 연명의료를 시행하지 않거나 중단할 수 있도록 미리 결정하는 제도입니다.",
  },
];

export default function AdvanceDirectivePage() {
  return (
    <>
      <Header title="연명의료 결정" />
      <ConsentIntro
        videoSubtitle="동영상으로 이해하는"
        videoTitle="사전연명의료의향서"
        faqItems={faqItems}
        consultHref={"/future/advance-directive/consult" as Route}
        applyHref={"/future/advance-directive/hospice" as Route}
        applyLabel="신청서 작성하기"
      />
    </>
  );
}
