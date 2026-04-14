"use client";

import { MessageCircle, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareSheetProps {
  /** 팝업의 중앙에 표시될 제목 */
  title: string;
  /** 닫기 버튼 또는 배경 클릭 시 호출될 함수 */
  onClose: () => void;
  /** 공유할 특정 URL (미지정 시 현재 페이지 URL 사용) */
  shareUrl?: string;
}

/**
 * 카카오톡, 문자 메시지 공유 및 링크 복사 기능을 제공하는 바텀 시트 컴포넌트입니다.
 */
export default function ShareSheet({ title, onClose, shareUrl }: ShareSheetProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 window에 접근 가능
    setCurrentUrl(shareUrl || (typeof window !== "undefined" ? window.location.href : ""));
  }, [shareUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex items-end z-[100] mx-auto max-w-md animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-[20px] pb-10 animate-in slide-in-from-bottom duration-300 ease-out"
        style={{ boxShadow: "0px -4px 20px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 모양 아이콘 */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>

        {/* 제목 */}
        <p className="text-xl font-bold text-hana-black-900 text-center mt-4 tracking-tight">
          {title}
        </p>

        {/* 공유 아이콘 영역 */}
        <div className="flex justify-center gap-14 mt-8">
          <button className="flex flex-col items-center gap-2 group" type="button">
            <div className="w-[100px] h-[100px] bg-hana-yellow-100 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
              <MessageCircle size={48} color="#F9D000" />
            </div>
            <span className="text-sm font-medium text-hana-black-600">카카오톡</span>
          </button>
          <button className="flex flex-col items-center gap-2 group" type="button">
            <div className="w-[100px] h-[100px] bg-hana-green-50 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
              <MessageSquare size={48} color="#008485" />
            </div>
            <span className="text-sm font-medium text-hana-black-600">문자 메시지</span>
          </button>
        </div>

        {/* 하단 링크 복사 영역 */}
        <div className="flex gap-3 px-6 mt-8">
          <div className="flex-1 h-[50px] px-4 border border-[#E3E5E8] rounded-xl flex items-center overflow-hidden bg-gray-50">
            <span className="text-sm text-gray-500 truncate">{currentUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`w-20 h-[50px] border rounded-xl text-sm font-medium transition-all ${
              copied
                ? "border-hana-green-700 bg-hana-green-50 text-hana-green-700"
                : "border-[#E5E5E5] bg-white text-black active:bg-gray-50"
            }`}
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
