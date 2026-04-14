"use client";

import { useRouter } from "next/navigation";
import { Printer, FileText } from "lucide-react";
import { Route } from "next";
import CompleteStep from "@/components/modules/CompleteStep";

interface CompletePageProps {
  confirmHref: Route;
}

export default function CompletePage({ confirmHref }: CompletePageProps) {
  const router = useRouter();

  return (
    <CompleteStep
      footer={
        <div className="flex flex-col gap-[20px] w-full">
          <button
            type="button"
            onClick={() => router.push(confirmHref)}
            className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white"
            style={{ backgroundColor: "#01A5AC" }}
          >
            확인
          </button>

          <div className="flex flex-row gap-[10px]">
            <button
              type="button"
              className="flex flex-row items-center justify-center gap-[8px] flex-1 h-[53px] rounded-[10px] border border-[#C4C4C4]"
            >
              <Printer size={24} color="#C4C4C4" />
              <span className="font-medium text-[14px] leading-[20px] tracking-[-0.31px] text-[#C4C4C4]">
                서류 작성하기
              </span>
            </button>
            <button
              type="button"
              className="flex flex-row items-center justify-center gap-[8px] flex-1 h-[53px] rounded-[10px] border border-[#C4C4C4]"
            >
              <FileText size={24} color="#C4C4C4" />
              <span className="font-medium text-[14px] leading-[20px] tracking-[-0.31px] text-[#C4C4C4]">
                등록하러 가기
              </span>
            </button>
          </div>
        </div>
      }
    >
      <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900">
        작성이 완료되었습니다.
      </h2>
    </CompleteStep>
  );
}
