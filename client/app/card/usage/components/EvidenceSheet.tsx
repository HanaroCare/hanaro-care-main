"use client";

import { MessageCircle, MessageSquare } from "lucide-react";
import { useState } from "react";

interface EvidenceSheetProps {
  onClose: () => void;
}

export default function EvidenceSheet({ onClose }: EvidenceSheetProps) {
  const [link] = useState("https://hanacareon.com/receipt");

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="absolute inset-0 bg-black/30 flex items-end z-50">
      <div
        className="w-full bg-white rounded-t-[20px] pb-10"
        style={{ boxShadow: "0px -4px 20px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>

        {/* 제목 */}
        <p className="text-xl font-medium text-hana-black-900 text-center mt-6 tracking-tight">
          증빙 요청 보내기
        </p>

        {/* 공유 방법 */}
        <div className="flex justify-center gap-14 mt-8">
          <button className="flex flex-col items-center gap-2">
            <div className="w-[100px] h-[100px] bg-hana-yellow-100 rounded-2xl flex items-center justify-center">
              <MessageCircle size={48} color="#F9D000" />
            </div>
            <span className="text-sm font-medium text-hana-black-600">카카오톡</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="w-[100px] h-[100px] bg-hana-green-50 rounded-2xl flex items-center justify-center">
              <MessageSquare size={48} color="#008485" />
            </div>
            <span className="text-sm font-medium text-hana-black-600">문자 메시지</span>
          </button>
        </div>

        {/* 링크 복사 */}
        <div className="flex gap-3 px-6 mt-8">
          <div className="flex-1 h-[50px] px-4 border border-[#E3E5E8] rounded-xl flex items-center">
            <span className="text-sm text-[#D1D5DB] truncate">{link}</span>
          </div>
          <button
            onClick={handleCopy}
            className="w-20 h-[50px] border border-[#E5E5E5] rounded-xl text-sm text-black"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
}