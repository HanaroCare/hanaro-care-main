"use client";

import { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/navigation/Header";
import CompleteStep from "@/components/modules/CompleteStep";

function ChargeCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardNm = searchParams.get("cardNm") || "카드";
  const amount = searchParams.get("amount") || "0";

  return (
    <div className="min-h-screen bg-white">
      <Header title="송금" />
      <CompleteStep
        className="pt-10 !min-h-[calc(100dvh-65px)]"
        footer={
          <button
            onClick={() => router.push("/card" as Route)}
            className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium"
          >
            완료
          </button>
        }
      >
        <p className="text-2xl font-semibold text-hana-black-800 text-center leading-[35px]">
          {cardNm} 카드에
          <br />
          {Number(amount).toLocaleString()}원 충전 완료
        </p>
      </CompleteStep>
    </div>
  );
}

export default function ChargeCompletePage() {
  return (
    <Suspense>
      <ChargeCompleteContent />
    </Suspense>
  );
}
