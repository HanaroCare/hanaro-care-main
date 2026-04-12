"use client";

import { MessageCircle, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

interface EvidenceSheetProps {
  onClose: () => void;
}

export default function EvidenceSheet({ onClose }: EvidenceSheetProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/30 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-[20px] pb-10"
        style={{ boxShadow: "0px -4px 20px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 - 드래그로 닫기 */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>

        {/* 제목 */}
        <p className="text-xl font-medium text-hana-black-900 text-center mt-4 tracking-tight">
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
          <div className="flex-1 h-[50px] px-4 border border-[#E3E5E8] rounded-xl flex items-center overflow-hidden">
            <span className="text-sm text-[#D1D5DB] truncate">{currentUrl}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`w-20 h-[50px] border rounded-xl text-sm font-medium transition-colors ${
              copied
                ? "border-hana-green-700 text-hana-green-700"
                : "border-[#E5E5E5] text-black"
            }`}
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
    </div>
  );
}