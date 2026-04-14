"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import CardView from "../../components/CardView";
import Header from "@/components/navigation/Header";

export default function CardIssueCompletePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      {/* 헤더 */}
      <Header title="카드 발급" />

      {/* 완료 */}
      <div className="flex flex-col items-center justify-center mt-24">
        <CheckCircle size={67} color="#008485" strokeWidth={2.5} />
        <p className="mt-6 text-2xl font-semibold text-hana-black-800 text-center">
          신청이 완료되었습니다.
        </p>
      </div>

      {/* 카드 미리보기 */}
      <div className="flex justify-center mt-12">
        <CardView cardNm="요양보호사1 카드" />
      </div>

      {/* 버튼 */}
      <div className="absolute bottom-8 left-0 right-0 px-6 flex flex-col gap-3">
        <button
          onClick={() => router.push("/card/add")}
          className="w-full h-[53px] rounded-xl border-2 border-border-gray text-[#99A1AF] text-base font-medium"
        >
          + 카드 추가하기
        </button>
        <button
          onClick={() => router.push("/card")}
          className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium hover:bg-hana-green-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
