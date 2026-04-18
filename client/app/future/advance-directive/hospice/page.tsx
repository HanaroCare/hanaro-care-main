"use client";

import { useRouter } from "next/navigation";
import { Route } from "next";
import { AlertBanner } from "@/components/modules/AlertBanner";
import { Lightbulb } from "lucide-react";
import DirectivePageLayout from "@/app/future/components/DirectivePageLayout";

export default function HospicePage() {
  const router = useRouter();
  const goNext = () => router.push("/future/advance-directive/view-consent" as Route);

  return (
      <DirectivePageLayout
          step={1}
          question={`추후, 호스피스\n완화의료를 이용하시겠어요?`}
          footer={
            <>
              <button onClick={goNext} className="w-full h-[56px] rounded-[12px] font-semibold text-white bg-[#01A5AC]">
                동의하고 도움 받기
              </button>
              <button onClick={goNext} className="w-full h-[56px] rounded-[12px] font-semibold text-[#99A1AF] bg-[#F3F4F6]">
                건너뛰기
              </button>
            </>
          }
      >
        <AlertBanner
            message={"호스피스는 치료를 포기하는 것이 아니라,\n남은 시간 편안하게 보내도록 돕는 서비스입니다."}
            variant="note"
            icon={<Lightbulb size={20} className="text-amber-500" />}
        />
      </DirectivePageLayout>
  );
}
