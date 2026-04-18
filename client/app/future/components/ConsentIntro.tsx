"use client";

import { Play, Phone, FileText, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useState } from "react";
import PhonePopup from "./PhonePopup";

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
                                     }: ConsentIntroProps) {
  const router = useRouter();
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const isPhoneHref = String(consultHref).startsWith("tel:");
  const phoneNumber = isPhoneHref ? String(consultHref).replace("tel:", "") : "";

  const handleConsultClick = () => {
    if (isPhoneHref) {
      setShowPhonePopup(true);
    } else {
      router.push(consultHref);
    }
  };

  return (
      <div className="w-full bg-white flex flex-col">
        {/* 바닥 여백을 pb-[40px]로 늘려 버튼 아래 공간 확보 */}
        <div className="flex flex-col flex-1 overflow-y-auto pb-[40px]">

          {videoSrc ? (
              <div className="mx-[25px] mt-[24px] rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: "16/9" }}>
                <iframe
                    src={videoSrc}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
              </div>
          ) : (
              <div
                  className="mx-[25px] mt-[24px] h-[190px] rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #244242 0%, #173636 100%)",
                  }}
              >
                <div
                    className="flex items-center justify-center w-[60px] h-[60px] rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Play size={28} color="white" fill="white" />
                </div>
                <div className="flex flex-col items-center gap-1">
              <span className="font-medium text-[14px] leading-[21px] text-white opacity-80">
                {videoSubtitle}
              </span>
                  <span className="font-semibold text-[18px] leading-[26px] text-white">
                {videoTitle}
              </span>
                </div>
              </div>
          )}

          <div className="mx-[12px] mt-[36px] border border-[#F1F3F5] bg-[#F8F9FA] rounded-2xl p-[28px] flex flex-col gap-[20px]">
            {faqItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-[8px]">
                  <div className="flex flex-row items-center gap-[6px]">
                    <Info size={16} color="#008485" />
                    <span className="font-bold text-[14px] leading-[22px] text-[#1A212D]">
                  {item.question}
                </span>
                  </div>
                  <p className="font-normal text-[13px] leading-[22px] text-[#4B5563] pl-[22px]">
                    {item.answer}
                  </p>
                </div>
            ))}
          </div>

          <div className="flex flex-row gap-[10px] mx-[25px] mt-[40px]">
            <button
                onClick={handleConsultClick}
                className="flex flex-row items-center justify-center gap-2 flex-1 h-[56px] rounded-[12px] transition-active"
                style={{ backgroundColor: "#F0F9FA" }}
            >
              <Phone size={18} color="#008485" />
              <span className="font-semibold text-[15px] text-[#008485]">
              전화 상담
            </span>
            </button>
            <button
                onClick={() => router.push(applyHref)}
                className="flex flex-row items-center justify-center gap-2 flex-[1.2] h-[56px] rounded-[12px] shadow-md transition-active"
                style={{ backgroundColor: "#01A5AC" }}
            >
              <FileText size={18} color="white" />
              <span className="font-semibold text-[15px] text-white">
              {applyLabel}
            </span>
            </button>
          </div>
        </div>

        {showPhonePopup && (
            <PhonePopup
                phone={phoneNumber}
                name="전화 상담"
                onClose={() => setShowPhonePopup(false)}
            />
        )}
      </div>
  );
}
