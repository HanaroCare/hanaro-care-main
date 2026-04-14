"use client";

import { useRouter } from "next/navigation";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import DotIndicator from "@/app/future/components/DotIndicator";
import { AlertBanner } from "@/components/modules/AlertBanner";
import { Lightbulb } from "lucide-react";

export default function HospicePage() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="연명의료 결정" />

      <div className="flex flex-col flex-1 px-[25px] pt-[65px]">
        {/* dot indicator */}
        <div className="flex justify-center mt-[54px]">
          <DotIndicator total={3} current={1} />
        </div>

        {/* 질문 */}
        <h2 className="font-medium text-[22px] leading-[33px] tracking-[-0.02em] text-black mt-[61px]">
          추후, 호스피스 완화의료를{"\n"}이용하시겠어요?
        </h2>

        {/* 안내 박스 */}
        <div className="mt-[103px]">
          <AlertBanner
            message="호스피스는 치료를 포기하는 것이 아니라, 남은 시간을 편안하게 보내도록 돕는 서비스입니다."
            variant="note"
            icon={<Lightbulb size={22} />}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[7px] px-[25px] pb-[30px] bg-white">
        <button
          onClick={() =>
            router.push("/future/advance-directive/view-consent" as Route)
          }
          className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white"
          style={{ backgroundColor: "#01A5AC" }}
        >
          동의하고 도움 받기
        </button>
        <button
          onClick={() =>
            router.push("/future/advance-directive/view-consent" as Route)
          }
          className="w-full h-[53px] rounded-[10px] font-semibold text-[16px] text-[#99A1AF] bg-[#E5E7EB]"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
