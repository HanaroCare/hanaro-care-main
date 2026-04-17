"use client";

import { Play, Phone, FileText, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Route } from "next";

interface FaqItem {
  question: string;
  answer: string;
}

interface ConsentIntroProps {
  videoSubtitle: string;
  videoTitle: string;
  videoSrc?: string;
  faqItems: FaqItem[];
  consultHref: Route;
  applyHref: Route;
  applyLabel: string;
  onApplyClick?: () => void;
}

export default function ConsentIntro({
  videoSubtitle,
  videoTitle,
  videoSrc,
  faqItems,
  consultHref,
  applyHref,
  applyLabel,
  onApplyClick,
}: ConsentIntroProps) {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      {/* 스크롤 컨테이너 */}
      <div className="flex flex-col flex-1 overflow-y-auto pb-[85px] pt-[65px]">
        {/* 동영상 배너 */}
        {videoSrc ? (
          <div className="mx-[25px] mt-[38px] rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={videoSrc}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            className="mx-[25px] mt-[38px] h-[180px] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #244242 0%, #173636 100%)",
            }}
          >
            <div
              className="flex items-center justify-center w-[56px] h-[56px] rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Play size={28} color="white" fill="white" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-medium text-[14px] leading-[21px] text-white">
                {videoSubtitle}
              </span>
              <span className="font-medium text-[16px] leading-[24px] text-white">
                {videoTitle}
              </span>
            </div>
          </div>
        )}

        {/* 설명 카드 */}
        <div className="mx-[25px] mt-[20px] border border-[#E3E5E8] rounded-xl p-[24px] flex flex-col gap-[25px]">
          {faqItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-[3px]">
              <div className="flex flex-row items-center gap-[5px]">
                <Info size={15} color="#000000" />
                <span className="font-semibold text-[13px] leading-[21px] text-[#1A212D]">
                  {item.question}
                </span>
              </div>
              <p className="font-normal text-[12px] leading-[21px] text-[#6B7280]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-row gap-[7px] px-[25px] pb-[16px] bg-white">
        <button
          onClick={() => router.push(consultHref)}
          className="flex flex-row items-center justify-center gap-2 flex-1 h-[53px] rounded-[10px]"
          style={{ backgroundColor: "#E9F8F9" }}
        >
          <Phone size={16} color="#008485" />
          <span className="font-semibold text-[14px] leading-[20px] tracking-[-0.15px] text-[#008485]">
            전화 상담하기
          </span>
        </button>
        <button
          onClick={() => router.push(applyHref)}
          className="flex flex-row items-center justify-center gap-2 flex-1 h-[53px] rounded-[10px]"
          style={{ backgroundColor: "#01A5AC" }}
        >
          <FileText size={16} color="white" />
          <span className="font-semibold text-[14px] leading-[24px] text-white">
            {applyLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
