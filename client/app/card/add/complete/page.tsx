"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import CompleteStep from "@/components/modules/CompleteStep";
import CardView from "../../components/CardView";
import PrimaryButton from "@/components/baseelements/PrimaryButton";

function CardIssueCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId") ?? "1";
  const designCd = String.fromCharCode(64 + Number(designId));

  return (
    <div className="min-h-screen bg-white">
      <Header title="카드 발급" />
      <CompleteStep
        className="pt-10 !min-h-[calc(100dvh-65px)]"
        footer={
          <>
            <button
              onClick={() => router.push("/card/add" as Route)}
              className="w-full h-[53px] rounded-xl border-2 border-border-gray text-[#99A1AF] text-base font-medium"
            >
              + 카드 추가하기
            </button>
            <PrimaryButton
              label="홈으로 돌아가기"
              onClick={() => router.push("/card" as Route)}
              fullWidth={true}
            />
          </>
        }
      >
        <h2 className="text-[1.75rem] font-bold text-gray-900 mb-3 leading-tight tracking-tight">
          신청이 완료되었습니다.
        </h2>
        <p className="text-[1.125rem] text-gray-500 mb-8 leading-relaxed">
          카드가 발급되었어요
        </p>
        <CardView cardNm="발급 완료" designCd={designCd} />
      </CompleteStep>
    </div>
  );
}

export default function CardIssueCompletePage() {
  return (
    <Suspense>
      <CardIssueCompleteContent />
    </Suspense>
  );
}
