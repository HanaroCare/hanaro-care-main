"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import CardView from "../../components/CardView";

export default function CardIssueCompletePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 발급</span>
        <div className="w-8" />
      </div>

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
          onClick={() => router.push("/card")}
          className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium hover:bg-hana-green-700 transition-colors"
        >
          + 카드 추가하기
        </button>
        <button
          onClick={() => router.push("/card")}
          className="w-full h-[53px] rounded-xl border-2 border-border-gray text-[#99A1AF] text-base font-medium"
        >
          카드 관리 보기
        </button>
      </div>
    </div>
  );
}